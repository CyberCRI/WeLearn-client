import yaml
from typing import TypedDict

class RegexesUsersMapping(TypedDict):
    name: str
    regex: str
    users: list[str]

UsersKeyMapping = dict[str, str]

class HumanUsableSops(TypedDict):
    usersKeyMapping: UsersKeyMapping
    regexesUsersMappings: list[RegexesUsersMapping]

creation_rules = []


with open('human-usable.sops.yaml') as f:
    config: HumanUsableSops = yaml.load(f, Loader=yaml.FullLoader)

    for regexesUsersMapping in config['regexesUsersMappings']:
        usersKeys = []
        for user in regexesUsersMapping['users']:
            try:
                matchingKey = config['usersKeyMapping'][user]
            except KeyError as e:
                print(f"User {user} not found in usersKeyMapping")
                raise e
            usersKeys.append(matchingKey)
        creation_rules.append({
            "path_regex": regexesUsersMapping['regex'],
            "age": ",".join(usersKeys)
        })

with open('.sops.yaml', "w") as f:
    yaml.safe_dump({
        "creation_rules": creation_rules
    }, f)
