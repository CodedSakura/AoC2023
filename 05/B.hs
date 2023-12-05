import Data.List.Split

tuplify2 :: [a] -> (a, a)
tuplify2 [x, y] = (x, y)

tuplify3 :: [a] -> (a, a, a)
tuplify3 [x, y, z] = (x, y, z)

type Seed = (Int, Int)

type Map = [(Int, Int, Int)]

parseSeeds :: String -> [Seed]
parseSeeds s = map tuplify2 (chunksOf 2 (map read (tail (splitOn " " s)) :: [Int]))

parseMap :: String -> Map
parseMap s =
    map (\l -> tuplify3 (map read (splitOn " " l) :: [Int])) (tail (splitOn "\n" s))

applyMap :: Seed -> Map -> Map -> [Seed]
applyMap (seedSrc, seedLen) [] fullMap =
    let mapSrcs = map (\(_, s, _) -> s) (filter (\(_, s, _) -> seedSrc < s && (seedSrc + seedLen) > s) fullMap)
    in
        if length mapSrcs > 0
        then
            let minMapSrc = minimum mapSrcs
            in [(seedSrc, minMapSrc - seedSrc)] ++ applyMap (minMapSrc, (seedSrc + seedLen) - minMapSrc) fullMap fullMap
        else
            [(seedSrc, seedLen)]
applyMap v ((dest, src, len):xs) fullMap =
    let seedSrc = fst v
        seedLen = snd v
    in 
        if seedSrc >= src && seedSrc < src + len
        then 
            let mappedLen = min ((src + len) - seedSrc) seedLen
                mappedSeed = (dest + (seedSrc - src), mappedLen)
                remainingLen = (seedSrc + seedLen) - (src + len)
            in 
                if remainingLen > 0
                then
                    let newSeed = (src + len, remainingLen)
                    in [mappedSeed] ++ applyMap newSeed fullMap fullMap
                else
                    [mappedSeed]
        else applyMap v xs fullMap

applyAllMaps :: Seed -> [Map] -> [Seed]
applyAllMaps v [] = [v]
applyAllMaps v (m:xs) = concat (map (\r -> applyAllMaps r xs) (applyMap v m m))

main = do
    contents <- readFile "input.txt"
    let sections = splitOn "\n\n" contents
    let seeds = parseSeeds (head sections)
    let maps = map parseMap (tail sections)
    print (minimum (map (\s -> minimum (map fst (applyAllMaps s maps))) seeds))
