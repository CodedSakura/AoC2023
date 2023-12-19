DAY = $(shell date +'%d')

default:
	@echo "Day $(DAY)"

start:
	mkdir $(DAY)
	touch $(DAY)/{A.js,input.txt,test.txt}
	@echo "Starting day $(DAY)"

end:
	git add . 
	git commit -m "Day $(DAY)"
	git push
	@echo "Ended day $(DAY)"
