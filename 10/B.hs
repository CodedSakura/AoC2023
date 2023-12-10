import Data.List

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

mapSize :: PipeMap -> Pos
mapSize pipes = (length (head pipes), length pipes)

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

isInside :: PipeMap -> Pos -> Dir -> Bool
isInside pipes (x,y) d = rayCast (take x (pipes !! y)) `mod` 2 == 1
    where
        rayCast [] = 0
        rayCast (s:xs)
            | isPipeFacing s d  = 1 + rayCast xs
            | otherwise         = rayCast xs

allInside :: PipeMap -> [Pos] -> [Pos]
allInside pipes loop = 
    let (mx, my) = mapSize pipes
    in 
        [(x,y) | y <- [0..(my-1)], x <- [0..(mx-1)], isInside pipes (x,y) N, not (elem (x,y) loop)]

displayPositions :: [Pos] -> Pos -> [[Char]]
displayPositions pos (maxX,maxY) = [[if elem (x,y) pos then '*' else '.' | x <- [0..maxX-1]] | y <- [0..maxY-1]]

getCorrectStart :: PipeMap -> PipeSegment
getCorrectStart pipes =
    let s@(sx,sy) = findStart pipes
        neighbors = getConnectedPipes pipes s
        [a, b] = [(nx-sx, ny-sy) | (nx, ny) <- neighbors]
    in case a of
        (-1, 0) -> case b of
            ( 1, 0) -> '-'
            (0, -1) -> 'J'
            (0,  1) -> '7'
        ( 1, 0) -> case b of
            (-1, 0) -> '-'
            (0, -1) -> 'L'
            (0,  1) -> 'F'
        (0, -1) -> case b of
            ( 1, 0) -> 'L'
            (-1, 0) -> 'J'
            (0,  1) -> '|'
        (0,  1) -> case b of
            ( 1, 0) -> 'F'
            (-1, 0) -> '7'
            (0, -1) -> '|'

main = do
    pipeMap <- fmap lines $ readFile "input.txt"
    let loop = findLoop pipeMap (findStart pipeMap)
    let correctedPipeMap = [[if c == 'S' then getCorrectStart pipeMap else (if elem (x,y) loop then c else '.') | (c,x) <- zip line [0..]] | (line,y) <- zip pipeMap [0..]]
    -- putStr $ unlines $ correctedPipeMap
    -- putStr "\n"
    let inside = allInside correctedPipeMap loop
    -- putStr $ unlines $ displayPositions inside (mapSize pipeMap)
    print $ length inside