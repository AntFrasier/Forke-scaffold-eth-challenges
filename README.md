# 🏗 scaffold-eth | 🏰 BuidlGuidl | Challenge-multi-sig 👛

## 👇🏼 What I Did :

I really wanted to dive into the multisig :) Please feel free to give any feedBack about the code. [![Twitter URL](https://img.shields.io/twitter/url/https/twitter.com/maranberc.svg?style=social&label=Follow%20MaranberC)](https://twitter.com/MaranberC)
 

![presentation](https://user-images.githubusercontent.com/84241354/214037046-ae7714c5-8984-476c-9337-b211e344a0e0.JPG)


# Added roles 

I added roles into the multisig, it definitly has to be improved. The GOD role, is just for testing it gives all the right to ... god :p If your are admin you'r allow to propose new role, and allow to remove TX from the dataBase.

user mode : 

![userMode](https://user-images.githubusercontent.com/84241354/214037086-e58a1117-2eab-4a46-a2d0-b91bcb22f35f.JPG)


Admin and God mode :

![adminMode](https://user-images.githubusercontent.com/84241354/214037119-f015b5fe-b8b2-4ade-bd01-2fb3a063e619.JPG)


The same to remove a tx from the database :

user mode :

![removeUser](https://user-images.githubusercontent.com/84241354/214037143-22fbecd2-544a-48f0-aba3-54b5db0c6bdb.JPG)


Admin and God mode :

![removeAdmin](https://user-images.githubusercontent.com/84241354/214037158-c103205f-9cb8-4716-a1e3-eae9b2c24d27.JPG)


# Added a custom calldata 

I added a custom callData. You just have to put the contract address that you want to call for exemple goerli testnet token (TST) : 0x7af963cF6D228E564e2A0aA0DdBF06210B38615D

![custonCallData](https://user-images.githubusercontent.com/84241354/214037215-127dc212-21a9-48c8-b3ae-20e4113590f4.JPG)



You can add a mount if needed 💸.
Then add the function name (⚠️ case sensitive) with args, exemple mint(address,uint256)

![custonCallDataMint](https://user-images.githubusercontent.com/84241354/214037242-3fe8159d-4d39-4d8e-9082-54221dde7613.JPG)


Then propose and wait to the tx be signed by the members.

contract address on Goerli : 0xdfe0b186EeE161685e266f3d3F852611d66d106b

# 💬 Support Chat

Join the telegram [support chat 💬](https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA) to ask questions and find others building with 🏗 scaffold-eth!

---

🙏 Please check out our [Gitcoin grant](https://gitcoin.co/grants/2851/scaffold-eth) too!

# TODO : 
- when role is changed the front has to refresh
