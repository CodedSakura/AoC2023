import Data.List
import Data.Maybe
import Debug.Trace
-- import qualified Data.Set as Set
import Data.Graph

-- neighbors d l = [ (x+dx) * width + (y+dy) | 
--         [ dx, dy ] <- [ [ -1, 0 ], [ 1, 0 ], [ 0, -1 ], [ 0, 1 ] ], 
--         x+dx >= 0, y+dy >= 0, x+dx < width, y+dy < height,
--         isValidNextNeighbor [dx, dy]
--     ]
--     where
--         [ width, height ] = [ length $ head d, length d ] 
--         [ x, y ] = [ l `mod` width, l `div` width ]

--         isValidNextNeighbor [-1,  0] = d !! y !! (x-1) /= '#'
--         isValidNextNeighbor [ 1,  0] = d !! y !! (x+1) /= '#'
--         isValidNextNeighbor [ 0, -1] = d !! (y-1) !! x /= '#'
--         isValidNextNeighbor [ 0,  1] = d !! (y+1) !! x /= '#'
neighbors d l = [ l+dl | 
        dl <- [ -1, 1, -width, width ], 
        l+dl >= 0, l+dl < width * height,
        get d (l+dl) /= '#'
    ]
    where
        [ width, height ] = [ length $ head d, length d ] 

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

-- makeVertices d p = mkv [p] []
--     where 
--         mkv [] _ = []
--         mkv (p:xs) visited = 
--             let nbrs = filter (\v -> not $ v `elem` visited) $ neighbors d p
--             in map (\v -> (p, v)) (trace (show nbrs) nbrs) ++ mkv nbrs (p:visited)

notIn l v = not $ v `elem` l

findSegments d p = fs [p] [] 0
    where
        fs [] _ _ = []
        fs (p:xs) visited prev = 
            let seg = fs' p [prev]
                next = filter (\v -> (not $ v `elem` seg) && (not $ v `elem` visited)) $ neighbors d $ last seg
            in (init seg) : (fs next (seg++visited) (last seg)) ++ (fs xs (seg++visited) prev)

        fs' p visited =
            let nb = filter (\v -> not $ v `elem` visited) $ neighbors d p
            in if length nb == 1 
                then p:(fs' (head nb) (p:visited))
                else [ p ]

main = do
    contents <- fmap lines $ readFile "test.txt"
    let [ width, height ] = [ length $ head contents, length contents ]
    let start = fromJust $ elemIndex '.' $ head contents
    let end = (fromJust $ elemIndex '.' $ last contents) + (height - 1) * width
    -- print start
    let segments = findSegments contents start
    print $ length segments
    -- print $ map (get contents) $ neighbors contents (3*width+11)
    -- print $ get contents 119
    -- print $ makeVertices contents start
    -- print $ neighbors contents 24
    -- print $ sortOn length $ bfs contents start
    -- let path = last $ sortOn length $ paths contents start
    -- print path
    -- putStrLn $ unlines [[if x+y*width `elem` (concat segments) then 'O' else contents !! y !! x | x <- [0..width-1]] | y <- [0..height-1]]