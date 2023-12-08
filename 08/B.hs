import Data.List.Split
import Debug.Trace
import Data.MemoCombinators.Class (memoize)

type Node = [Char]
type Instruction = Char
type Path = (Node, (Node, Node))

parsePathLine :: [Char] -> Path
parsePathLine s = 
    let [from, next] = splitOn " = (" s
        [left, right] = splitOn ", " $ head $ splitOn ")" next
    in (from, (left, right))

findPath :: Node -> [Path] -> Path
findPath _ [] = error "?"
findPath s (n:xn)
    | s == fst n    = n
    | otherwise     = findPath s xn

followInstruction :: Instruction -> Node -> [Path] -> Node
followInstruction = 
    memoize followInstruction'
    where
        followInstruction' instruction from network =
            let nextChoice = snd $ findPath from network
            in if instruction == 'L' then fst nextChoice else snd nextChoice

countSteps :: [Instruction] -> [Path] -> Int
countSteps instructions network = 
    lcmm $ map (\n -> cs instructions n) (findStart network)
    where
        cs :: [Instruction] -> Node -> Int
        cs _ [_,_,'Z'] = 0
        cs (i:xi) from =
            let ni = if xi == "" then instructions else xi
            in 1 + cs ni (followInstruction i from network)

        findStart :: [Path] -> [Node]
        findStart [] = []
        findStart ((n,_):xn)
            | last n == 'A' = [n] ++ findStart xn
            | otherwise     = findStart xn

        lcmm :: [Int] -> Int
        lcmm [] = 1
        lcmm (x:xs) = lcm x (lcmm xs)


main = do
    contents <- fmap lines $ readFile "input.txt"
    let instructions = head contents
    let network = map parsePathLine $ drop 2 contents
    print $ countSteps instructions network

-- did 'cheat' by reading conversation that mentioned LCM, and facepalmed that i hadn't thought of it lol
