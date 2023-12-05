import Data.List.Split

tuplify3 :: [a] -> (a, a, a)
tuplify3 [x,y,z] = (x,y,z)

type Map = [(Int, Int, Int)]

parseMap :: String -> Map
parseMap s =
    map (\l -> tuplify3 (map read (splitOn " " l) :: [Int])) (tail (splitOn "\n" s))

applyMap :: Int -> Map -> Int
applyMap v [] = v
applyMap v ((dest, src, len):xs)
    | v >= src && v < src + len = dest + (v - src)
    | otherwise                 = applyMap v xs

applyAllMaps :: Int -> [Map] -> Int
applyAllMaps v [] = v
applyAllMaps v (m:xs) = applyAllMaps (applyMap v m) xs

main = do
    contents <- readFile "input.txt"
    let sections = splitOn "\n\n" contents
    let seeds = map read (tail (splitOn " " (head sections))) :: [Int]
    let maps = map parseMap (tail sections)
    print $ minimum (map (\s -> applyAllMaps s maps) seeds)
