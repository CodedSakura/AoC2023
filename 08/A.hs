import Data.List.Split
import Debug.Trace

type Node = ([Char], ([Char], [Char]))

parseNodeLine :: [Char] -> Node
parseNodeLine s = 
    let [from, next] = splitOn " = (" s
        [left, right] = splitOn ", " $ head $ splitOn ")" next
    in (from, (left, right))

findNode :: [Char] -> [Node] -> Node
findNode _ [] = error "?"
findNode s (n:xn)
    | s == fst n    = n
    | otherwise     = findNode s xn

followInstruction :: Char -> [Char] -> [Node] -> [Char]
followInstruction instruction from network =
    let nextChoice = snd $ findNode from network
    in if instruction == 'L' then fst nextChoice else snd nextChoice

countSteps :: [Char] -> [Node] -> Int
countSteps instructions network = 
    do 
        cs instructions instructions "AAA" network
    where
        cs :: [Char] -> [Char] -> [Char] -> [Node] -> Int
        cs _ _ "ZZZ" _ = 0
        cs (i:xi) iBak from network =
            let ni = if xi == "" then iBak else xi
            in 1 + cs ni iBak (followInstruction i from network) network


main = do
    contents <- fmap lines $ readFile "input.txt"
    let instructions = head contents
    let network = map parseNodeLine $ drop 2 contents
    print $ countSteps instructions network