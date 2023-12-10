
type Pos = (Int, Int)
type PipeSegment = Char
type PipeMap = [[PipeSegment]]

data Dir = N | S | W | E deriving (Eq, Enum, Show)

invertDir :: Dir -> Dir
invertDir d
    | d == N = S
    | d == S = N
    | d == E = W
    | d == W = E

addDirPos :: Pos -> Dir -> Pos
addDirPos (x, y) d
    | d == N = (x, y-1)
    | d == S = (x, y+1)
    | d == E = (x+1, y)
    | d == W = (x-1, y)

getPipe :: PipeMap -> Pos -> PipeSegment
getPipe pipes (x, y)
    | x < 0 || y < 0            = '.'
    | y >= (length pipes)       = '.'
    | x > (length (head pipes)) = '.'
    | otherwise                 = (pipes !! y) !! x

isPipeFacing :: PipeSegment -> Dir -> Bool
isPipeFacing pipe dir
    | pipe == '|'   = dir == N || dir == S
    | pipe == '-'   = dir == E || dir == W
    | pipe == 'L'   = dir == N || dir == E
    | pipe == 'J'   = dir == N || dir == W
    | pipe == '7'   = dir == S || dir == W
    | pipe == 'F'   = dir == S || dir == E
    | pipe == 'S'   = True
    | otherwise     = False

checkConnection :: PipeSegment -> PipeSegment -> Dir -> Bool
checkConnection from to dir = isPipeFacing from dir && isPipeFacing to (invertDir dir)

getConnectedPipes :: PipeMap -> Pos -> [Pos]
getConnectedPipes pipes pos =
    let pipe = getPipe pipes pos
    in case pipe of 
        '.' -> []
        '|' -> getConnectedPipes' pipes pos [N, S]
        '-' -> getConnectedPipes' pipes pos [E, W]
        'L' -> getConnectedPipes' pipes pos [N, E]
        'J' -> getConnectedPipes' pipes pos [N, W]
        '7' -> getConnectedPipes' pipes pos [S, W]
        'F' -> getConnectedPipes' pipes pos [S, E]
        'S' -> getConnectedPipes' pipes pos [N, S, W, E]

getConnectedPipes' :: PipeMap -> Pos -> [Dir] -> [Pos]
getConnectedPipes' _ _ [] = []
getConnectedPipes' pipes pos (d:xd) =
    (if checkConnection (getPipe pipes pos) (getPipe pipes (addDirPos pos d)) d then [addDirPos pos d] else [])
    ++ getConnectedPipes' pipes pos xd

findStart :: PipeMap -> Pos
findStart pipes = head [ (x, y) | (y, row) <- zip [0..] pipes, (x, char) <- zip [0..] row, char == 'S' ]

findLoop :: PipeMap -> Pos -> [Pos]
findLoop pipes pos = dfs [] [pos]
    where
        dfs visited [] = reverse visited
        dfs visited (x:xs)
            | elem x visited    = dfs visited xs
            | otherwise         = dfs (x:visited) ((getConnectedPipes pipes x) ++ xs)

main = do
    pipeMap <- fmap lines $ readFile "input.txt"
    print $ (length $ findLoop pipeMap (findStart pipeMap)) `div` 2