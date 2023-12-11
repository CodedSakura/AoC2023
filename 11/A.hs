import Data.List

isEmpty :: [Char] -> Bool
isEmpty "" = True
isEmpty ('.':xs) = isEmpty xs
isEmpty _ = False

expandEmptySpaceH :: [[Char]] -> [[Char]]
expandEmptySpaceH [] = []
expandEmptySpaceH (s:xs) = if isEmpty s then [s, s] ++ expandEmptySpaceH xs else s:(expandEmptySpaceH xs)

expandEmptySpaceV :: [[Char]] -> [[Char]]
expandEmptySpaceV s = transpose $ expandEmptySpaceH $ transpose s


findGalaxies :: [[Char]] -> [(Int, Int)]
findGalaxies s = [(x, y) | (x, row) <- zip [0..] s, (y, c) <- zip [0..] row, c == '#']

pairs :: [a] -> [(a, a)]
pairs l = [(x,y) | (x:ys) <- tails l, y <- ys]

distance :: ((Int, Int), (Int, Int)) -> Int
distance ((x1,y1), (x2,y2)) = abs(x1 - x2) + abs(y1 - y2)

main = do
    contents <- fmap lines $ readFile "input.txt"
    let expandedSpace = expandEmptySpaceV $ expandEmptySpaceH contents
    print $ sum $ map distance $ pairs $ findGalaxies expandedSpace
