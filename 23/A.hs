import Data.List
import Data.Maybe
import Debug.Trace
-- import qualified Data.Set as Set
import Data.Graph

isValidNextNeighbor d [x, y] [-1,  0] = d !! y !! (x-1) == '.' || d !! y !! (x-1) == '<'
isValidNextNeighbor d [x, y] [ 1,  0] = d !! y !! (x+1) == '.' || d !! y !! (x+1) == '>'
isValidNextNeighbor d [x, y] [ 0, -1] = d !! (y-1) !! x == '.' || d !! (y-1) !! x == '^'
isValidNextNeighbor d [x, y] [ 0,  1] = d !! (y+1) !! x == '.' || d !! (y+1) !! x == 'v'

neighbors d l =
    let [ width, height ] = [ length $ head d, length d ] 
        [ x, y ] = [ l `mod` width, l `div` width ]
    in [ (x+dx) * width + (y+dy) | 
        let [mx, my] = [ length $ head d, length d ], 
        dx <- [-1..1], dy <- [-1..1], 
        abs(dx) + abs(dy) == 1,
        x+dx >= 0, y+dy >= 0, x+dx < mx, y+dy < my,
        isValidNextNeighbor d [x, y] [dx, dy]
    ]

get d l = 
    let [ width, height ] = [ length $ head d, length d ] 
        [ x, y ] = [ l `mod` width, l `div` width ]
    in d !! y !! x

-- paths :: [[Char]] -> [Int] -> [[[Int]]]
-- paths d start = paths' [start] []
--     where
--         paths' [] visited = [visited]
--         paths' (p:xs) visited = 
--             let next = filter (\n -> not $ n `elem` visited) $ neighbors d p
--             in paths' next (p:visited) ++ paths' xs (p:visited)

-- bfs g ts = f ts b [] Set.empty
--   where
--     f x fw bw s
--       | Set.member x s = fw bw s
--       | otherwise      = x : fw (neighbors g x : bw) (Set.insert x s)

--     b [] _ = []
--     b qs s = foldl (foldr f) b qs [] s

makeVertices d p = mkv [p] []
    where 
        mkv [] _ = []
        mkv (p:xs) visited = 
            let nbrs = filter (\v -> not $ v `elem` visited) $ neighbors d p
            in map (\v -> (p, v)) (trace (show nbrs) nbrs) ++ mkv nbrs (p:visited)

main = do
    contents <- fmap lines $ readFile "test.txt"
    let [ width, height ] = [ length $ head contents, length contents ]
    let start = fromJust $ elemIndex '.' $ head contents
    let end = (fromJust $ elemIndex '.' $ last contents) + (height - 1) * width
    print start
    print $ makeVertices contents start
    print $ map (get contents) $ neighbors contents 24
    -- print $ sortOn length $ bfs contents start
    -- let path = last $ sortOn length $ paths contents start
    -- print path
    -- putStrLn $ unlines [[if [x, y] `elem` path then 'O' else contents !! y !! x | x <- [0..(length $ head contents) - 1]] | y <- [0..length contents]]