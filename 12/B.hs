import Data.List
import Data.List.Split
import Debug.Trace

type SpringData = ([Char], [Int])

parseLine :: String -> SpringData
parseLine s =
    let [springs, numbers] = splitOn " " s
    -- in (springs, map read $ splitOn "," numbers)
    in (intercalate "?" (replicate 5 springs), map read $ splitOn "," (intercalate "," (replicate 5 numbers)))


count [] _ = 0
count (x:xs) y = (if x == y then 1 else 0) + count xs y

choose n 0 = 1
choose n k = (n * choose (n-1) (k-1)) `div` k

-- https://stackoverflow.com/a/52602906/8672525
subsets 0 _ = [[]]
subsets _ [] = []
subsets n (x : xs) = map (x :) (subsets (n - 1) xs) ++ subsets n xs

-- https://stackoverflow.com/a/12305818/8672525
rep k = concat . replicate k

unknownCombinations :: Int -> Int -> [[Char]]
unknownCombinations 0 working = [replicate working '.']
unknownCombinations broken 0 = [replicate broken '#']
unknownCombinations broken working = (map ('#':) $ unknownCombinations (broken-1) working) ++ (map ('.':) $ unknownCombinations broken (working-1))

applyCombination :: [Char] -> [Char] -> [Char]
applyCombination s "" = s
applyCombination ('?':xs) (c:xc) = c:applyCombination xs xc
applyCombination (s:xs) xc = s:applyCombination xs xc

-- validate :: [Char] -> [Int] -> Bool
validate s n = (map length $ filter (/="") $ splitOn "." s) == n

-- process (s, n) = 
--     let broken = count s '#'
--         working = count s '.'
--         unknown = count s '?'
--         totalBroken = sum n
--         unknownBroken = totalBroken - broken
--         unknownWorking = unknown - unknownBroken
--     in filter (\s -> validate s n) $ map (applyCombination s) $ (unknownCombinations unknownBroken unknownWorking)

-- https://discord.com/channels/703363189081112647/1183861191769063504/1184015323050016808
process :: SpringData -> Int
process (s, b) = go s b False
    where
        go :: [Char] -> [Int] -> Bool -> Int
        go [] [] _ = 1
        go [] [0] _ = 1
        go [] _ _ = 0
        go ('?':xs) l c = (go ('.':xs) l c) + (go ('#':xs) l c)
        go ('#':xs) [] _ = 0
        go ('#':xs) (0:xl) _ = 0
        go ('#':xs) (l:xl) _ = go xs ((l-1):xl) True
        go ('.':xs) [] _ = go xs [] False
        go ('.':xs) (0:xl) _ = go xs xl False
        go ('.':xs) l False = go xs l False
        go ('.':xs) _ _ = 0

main = do
    contents <- fmap lines $ readFile "input.txt"
    print $ sum $ map process $ map parseLine contents
