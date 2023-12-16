import Data.List

data Dir = L | R | U | D deriving (Eq, Enum, Show)

moveDir (x, y) dir
    | dir == L  = (x-1, y)
    | dir == R  = (x+1, y)
    | dir == U  = (x, y-1)
    | dir == D  = (x, y+1)

horizontal L = True
horizontal R = True
horizontal _ = False

vertical d = not (horizontal d)

reflectCW L = D
reflectCW R = U
reflectCW U = R
reflectCW D = L

reflectCCW L = U
reflectCCW R = D
reflectCCW U = L
reflectCCW D = R

beam c p@(x, y) dir visited
    | x < 0 || y < 0        = []
    | y >= length c         = []
    | x >= length (c !! y)  = []
    | (length $ filter (\(d, pos) -> d == dir && pos == p) visited) > 0 = []
    | otherwise             =
        let enc = c !! y !! x
            newVisited = (dir, p):visited
        in case enc of 
            '.' -> p:beam c (moveDir p dir) dir newVisited
            '|' -> if horizontal dir then p:((beam c (moveDir p U) U newVisited) ++ (beam c (moveDir p D) D) newVisited) else p:beam c (moveDir p dir) dir newVisited
            '-' -> if vertical   dir then p:((beam c (moveDir p L) L newVisited) ++ (beam c (moveDir p R) R) newVisited) else p:beam c (moveDir p dir) dir newVisited
            '/' ->  let newDir = reflectCW  dir in p:beam c (moveDir p newDir) newDir newVisited
            '\\' -> let newDir = reflectCCW dir in p:beam c (moveDir p newDir) newDir newVisited
            otherwise -> [p]

main = do
    contents <- fmap lines $ readFile "input.txt"
    -- let contraption = [[(m, (x, y)) | (x, m) <- zip [0..] row] | (y, row) <- zip [0..] contents]
    print $ length $ nub $ beam contents (0, 0) R []