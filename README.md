# Webapp Quickstart

This is intended to be a full implementation of a webapp secured to satisfy ProtectedB.

## Build

Add `127.0.0.1	  webapp` to your hosts file

Run `setup.sh` to generate the secrets.\
_Note: run `winpty bash` if using git bash before executing the script_

To build all the images and start the stack: `docker-compose up --build`

## Other

### VSCode and the private Docker registry

VSCode might not like you connecting to the custom registry since the cert is self-signed.\
Adding this to your preferences json should fix it, be warned that it tells vscode to trust all self-signed certs.

```json
"docker.importCertificates": true,
"http.proxyStrictSSL": false
```

### Windows and port 80 being occupied

- Start menu => `View Local Services`
- Find `BranchCache`
- Properties
- Change \[Startup Type\] to `disabled`
- Press \[Stop\]
- Press \[OK\]

### Windows and filesystem volumes not mounting

[Steps taken from here](https://stackoverflow.com/questions/42203488/settings-to-windows-firewall-to-allow-docker-for-windows-to-share-drive/46854772#46854772)

- Start menu => `Hyper-V Manager`
- Right panel => `Virtual Switch Manager...`
- DockerNAT => Change \[Connection Type\] to `Private network`
- Change it back to `Internal network`
- Restart Docker
- Open powershell as administrator
- Set Docker network profile to 'Private': `Set-NetConnectionProfile -interfacealias "vEthernet (DockerNAT)" -NetworkCategory Private`
- Open \[Network and Sharing Center\] => Connections => \[vEthernet \(DockerNAT\)\] => Properties
- Uninstall \[File and Printer Sharing for Microsoft Networks\]
- Install... => Service => Microsoft => \[File and Printer Sharing for Microsoft Networks\]
- Open Docker settings => Shared Drives => Disable the `C` shared drive
- Enable the `C` shared drive and hit \[Apply\]
