# Configure local dev server

Our dev server runs on a custom domain `local.monkeys.com.co`,
so you need to edit your system's `etc/hosts` file so the domain maps to 127.0.0.1

## For Linux/ macOS

1. Open the terminal and bash the following command to open hosts file

```sh
sudo nano /etc/hosts
```

2. Add the following line at the bottom

```sh
127.0.0.1   local.monkeys.com.co
```

3. Save and close the file:

- Press `ctrl + o`, then `Enter` to save
- Press `ctrl + x` to exit
