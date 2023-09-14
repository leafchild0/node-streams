# node-streams
Playground for looking into streams. This small utility project shows the power of most underrated streams 
in Node - Transform and PassThrough. Pretty much pure JS and Node, some csv library.

## What it is doing
This project is using data from [London crimes 2008-2016](https://www.kaggle.com/datasets/jboysen/london-crime?resource=download)
which comes as a HUGE csv file. This file is possible to load into memory, but the idea is to show that this is not needed. 
As well as no need to wait until entire file is finished. From that data, 4 questions are answered:

- Did the number of crimes go up or down over the years?
- What are the most dangerous areas of London?
- What is the most common crime per area?
- What is the least common crime?

There are 2 approaches to do that - having a separate pipeline for each question and fork from readable stream
AND doing al it once and then passing to `PassThrough` stream. Both implemented there.

## How to install and run
Same as for any Node projects: run `npm i` to install all deps.
Then download file and put it in the project. Check file name in `package.json`. If all looks OK, run `npm run crime` to run the job.
Probably some changes will be needed in index file to pick the approach. I never said this is a PROD ready utility, but just a playground