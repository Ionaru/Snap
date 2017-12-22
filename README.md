# Snap
A super simple application that takes screenshots of websites at an optional interval.

### How to use (Standard):
1. Clone this repository.
2. Step into the newly created directory.
3. Copy `config/config.example.json` and rename the copy to `config/config.json`.
4. Configure the application by editing `config/config.json`.
5. Run `npm install`.
6. Run `npm start`.

### How to use (Docker):
1. Clone this repository.
2. Step into the newly created directory.
3. Copy `config/config.example.json` and rename the copy to `config/config.json`
4. Configure the application by editing `config/config.json`
5. Run `npm run docker-build`.
6. Either run `npm run docker-run` or run the docker by using another command (recommended).
7. Don't forget to mount a volume to access the screenshots!
