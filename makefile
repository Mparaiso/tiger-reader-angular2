# depdendencies :
# install nodejs
# install typescript ( npm install -g typescript )
# install lesscss ( npm install -g less )
# get make for windows if you don't have it.
# in the current directory, just run make

build:
	@tsc --rootDir ts --project ts --outDir js --removeComments
	@lessc less/styles.less css/styles.css
