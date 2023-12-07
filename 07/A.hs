import Data.List.Split
import Data.List

cardScore :: Char -> Int
cardScore 'A' = 14
cardScore 'K' = 13
cardScore 'Q' = 12
cardScore 'J' = 11
cardScore 'T' = 10
cardScore '9' = 9
cardScore '8' = 8
cardScore '7' = 7
cardScore '6' = 6
cardScore '5' = 5
cardScore '4' = 4
cardScore '3' = 3
cardScore '2' = 2

handStrength :: [Char] -> Int
handStrength s = sum $ map (\(a,b) -> a * 16^(5-b)) $ zip (map cardScore s) [1..]

compareHandStrength :: [Char] -> [Char] -> Ordering
compareHandStrength [] [] = EQ
compareHandStrength (a:xa) (b:xb)
    | a == b    = compareHandStrength xa xb
    | otherwise = compare (cardScore a) (cardScore b)

scoreHand :: [Char] -> Int
scoreHand h = 
    let kinds = reverse $ sort $ consecutives h
    in case head kinds of 
        5 -> 160
        4 -> 150
        3 -> if (head $ drop 1 kinds) == 2 then 140 else 130
        2 -> if (head $ drop 1 kinds) == 2 then 120 else 110
        otherwise -> 100

consecutives :: [Char] -> [Int]
consecutives [] = []
consecutives (s:xs) = 
    let rest = filter (\v -> v /= s) xs
    in [1+(length xs - length rest)] ++ consecutives rest

compareHands :: [Char] -> [Char] -> Ordering
compareHands a b = 
    if scoreHand a == scoreHand b 
        then compareHandStrength a b
        else compare (scoreHand a) (scoreHand b)

main = do
    contents <- fmap lines $ readFile "input.txt"
    let handBids = map (\s -> splitOn " " s) contents
    print $ 
        sum $ 
        map (\(n, [_, v]) -> n * (read v :: Integer)) $ 
        zip [1..] (sortBy (\[a,_] [b,_] -> compareHands a b) handBids)
