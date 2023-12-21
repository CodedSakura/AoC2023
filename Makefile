DAY = $(shell date +'%d')

default:
	@echo "Day $(DAY)"

start:
	mkdir $(DAY)
	touch $(DAY)/{A.js,input.txt,test.txt}
	printf 'const { readFileSync } = require("fs");\n\nconst contents = readFileSync("input.txt", { encoding: "utf-8" })\n' > $(DAY)/A.js
	subl $(DAY)/{A.js,test.txt}
	@echo "Starting day $(DAY)"

end:
	git add . 
	git commit -m "Day $(DAY)"
	git push
	@echo "Ended day $(DAY)"
