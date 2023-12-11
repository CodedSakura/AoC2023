import Data.List

type Pos = (Int, Int)

isEmpty :: [Char] -> Bool
isEmpty "" = True
isEmpty ('.':xs) = isEmpty xs
isEmpty _ = False

expandEmptySpaceH :: [[Char]] -> [Int]
expandEmptySpaceH [] = []
expandEmptySpaceH s = [i | (i, row) <- zip [0..] s, isEmpty row]

expandEmptySpaceV :: [[Char]] -> [Int]
expandEmptySpaceV s = expandEmptySpaceH $ transpose s

expandGalaxies :: [Pos] -> [Int] -> [Int] -> [Pos]
expandGalaxies [] _ _ = []
-- no clue why n-1, not n
expandGalaxies ((x,y):xs) hS vS = (x + 999999 * length (filter (<x) hS), y + 999999 * length (filter (<y) vS)) : expandGalaxies xs hS vS


findGalaxies :: [[Char]] -> [Pos]
findGalaxies s = [(x, y) | (x, row) <- zip [0..] s, (y, c) <- zip [0..] row, c == '#']

pairs :: [a] -> [(a, a)]
pairs l = [(x,y) | (x:ys) <- tails l, y <- ys]

distance :: (Pos, Pos) -> Int
distance ((x1,y1), (x2,y2)) = abs(x1 - x2) + abs(y1 - y2)


main = do
    contents <- fmap lines $ readFile "input.txt"
    let expandedSpaceH = expandEmptySpaceH contents
    let expandedSpaceV = expandEmptySpaceV contents
    let galaxies = findGalaxies contents
    let expandedGalaxies = expandGalaxies galaxies expandedSpaceH expandedSpaceV
    print $ sum $ map distance $ pairs $ expandedGalaxies
