import Data.List.Split

type Race = (Int, Int)

nonEmpty :: String -> Bool
nonEmpty "" = False
nonEmpty s = True

parseLine :: String -> [Int]
parseLine s = map read (tail (filter nonEmpty (splitOn " " s)))

-- runRace :: Race -> Int
runRace (time, record) = length (filter (\d -> d > record) (map (\t -> (time - t) * t) [1..time-1]))

main = do
    contents <- fmap lines $ readFile "input.txt"
    let times = parseLine (contents !! 0)
    let distances = parseLine (contents !! 1)
    let races = zip times distances
    print $ product (map runRace races)