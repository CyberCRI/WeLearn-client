# Sops

This repository is made for centralizing sops public keys to allow for storing secrets directly in target repositories.

The .sops.yaml is just an output file and should not be directly edited.
Edit the _human-usable.sops.yaml_ file first and then regenerate the _.sops.yaml_ file using the following process:

## Installation

### Add this repo as a submodule

To use the .sops.yaml file contained in this repo, at the root of your repository, add it as a submodule.

```
git submodule add ../sops.git
```

This will clone the `sops` repository at the root of yours in a `sops` folder.

### Make the .sops.yaml available to sops

By default sops will only look **up** recursively in the file tree to find a `.sops.yaml` file. It won't try to find the config file in the `sops` folder.

Create a symlink from the root of your repo to the submodule config file

```
ln -s sops/.sops.yaml .sops.yaml
```

## Usage

### Add, remove or edit a public key

Update the _human-usable.sops.yaml_ to either edit an user's key or add this user's to a regex.

### Install all the required tools

First, create a python virtualenv using python3.10 and activate it.

```
python -m virtualenv ./env
source ./env/bin/activate
```

Then, install requirements.

```
python -m pip install -r requirements.txt
```

### Actually updating the keys

Still in your virtualenv, run

```
python generate.py
```

This will update the _.sops.yaml_ file

### Commit to the sops repo

Commit and push to this repository with the required reviewers approvals.

### Update the submodule in the target repository

Run:

```
git submodule update
```

in your target repository, the _.sops.yaml_ at the root of your repository should be updated

### Update the secrets to take into account key edition

Run

```
./sops/update_keys.sh
```

to automatically update your secrets with updated age keys info.
