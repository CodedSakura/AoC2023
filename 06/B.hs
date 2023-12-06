import Data.List.Split

nonEmpty :: String -> Bool
nonEmpty "" = False
nonEmpty s = True

parseLine :: String -> Double
parseLine s = read (head $ drop 1 (splitOn ":" (filter (\c -> c /= ' ') s)))
-- parseLine s = map read (tail (filter nonEmpty (splitOn " " s)))

-- https://stackoverflow.com/a/7794725/8672525
quadRoots :: (Double, Double, Double) -> [Double]
quadRoots (a, b, c) = if d < 0 then [] else [x, y]
                        where
                          x = e + sqrt d / (2 * a)
                          y = e - sqrt d / (2 * a)
                          d = b * b - 4 * a * c
                          e = - b / (2 * a)

runRace :: (Double, Double) -> Int
runRace (time, record) =
    let [a, b] = quadRoots (-1, time, -record)
    in (floor b) - (ceiling a) + 1

main = do
    contents <- fmap lines $ readFile "input.txt"
    let times = parseLine (contents !! 0)
    let distances = parseLine (contents !! 1)
    print $ runRace (times, distances)
