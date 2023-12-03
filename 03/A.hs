pairEq :: Eq a => (a, a) -> (a, a) -> Bool
pairEq (a, b) (c, d) = a == c && b == d

deduplicatePairList :: (Eq a, Eq b) => [(a, b)] -> [(a, b)]
deduplicatePairList [] = []
deduplicatePairList (x:xs) = [x] ++ deduplicatePairList (filter (\y -> y /= x) xs)

deduplicatePairListList :: (Eq a, Eq b) => [[(a, b)]] -> [[(a, b)]]
deduplicatePairListList [] = []
deduplicatePairListList (x:xs) = [x] ++ deduplicatePairListList (filter (\y -> y /= x) xs)

slice :: Int -> Int -> [a] -> [a]
slice from to xs = take (to - from + 1) (drop from xs)


isSymbol :: Char -> Bool
isSymbol '.' = False
isSymbol c = c < '0' || c > '9'

isNumber :: Char -> Bool
isNumber c = c >= '0' && c <= '9'


findAllSymbols :: [[Char]] -> [(Int, Int)]
findAllSymbols [] = []
findAllSymbols d =
    concat [
        (map (\(x, c) -> (x, y)) (filter (\(_, c) -> isSymbol c) (zip [0..] s :: [(Int, Char)])))
        | (y, s) <- (zip [0..] d :: [(Int, [Char])])
    ]

getSize :: [[Char]] -> (Int, Int)
getSize s = (length s, length (head s))

neighbors :: (Int,Int) -> [(Int,Int)]
neighbors (x,y) = 
    (map (\(cx, cy) -> (cx+x, cy+y))
            (filter (\p -> not (pairEq p (0,0))) 
                (concat [
                    map (\cx -> (cx, cy)) ([-1..1] :: [Int])
                    | cy <- ([-1..1] :: [Int])
                ])))

validNeighbors :: [[Char]] -> (Int, Int) -> [(Int, Int)]
validNeighbors s p =
    let (sx, sy) = getSize s
        n = neighbors p
    in filter (\(cx, cy) -> cx >= 0 && cx < sx && cy >= 0 && cy < sy) n

sybmolAtPos :: [[Char]] -> (Int, Int) -> Char
sybmolAtPos s (x,y) = (s!!y)!!x

findNumericNeighbors :: [[Char]] -> (Int, Int) -> [(Int, Int)]
findNumericNeighbors s p = filter (\np -> isNumber (sybmolAtPos s np)) (validNeighbors s p)


searchDigitForward :: [Char] -> [Char]
searchDigitForward [] = []
searchDigitForward (x:xs)
    | isNumber x = [x] ++ searchDigitForward xs
    | otherwise = []

getNumberPos :: [[Char]] -> (Int, Int) -> [(Int, Int)]
getNumberPos s (x,y) = 
    let (sx, _) = getSize s
        start = slice 0 (x-1) (s !! y)
        end = slice (x+1) sx (s!!y)
        fwd = length (searchDigitForward end)
        bwd = length (reverse (searchDigitForward (reverse start)))
        lx = x - bwd
        rx = x + fwd
    in map (\cx -> (cx, y)) [lx..rx]

main = do
    contents <- fmap lines $ readFile "input.txt"
    let foundDigits = deduplicatePairList (concat (map (\p -> findNumericNeighbors contents p) (findAllSymbols contents)))
    let foundNumbers = (deduplicatePairListList (map (\p -> getNumberPos contents p) foundDigits))
    let numbers = (map (\l -> read (map (\p -> sybmolAtPos contents p) l) :: Int) foundNumbers)
    print $ sum numbers
