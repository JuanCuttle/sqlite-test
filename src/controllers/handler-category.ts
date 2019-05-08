
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { User } from "../entity/User";

import {Category} from "../entity/Category";

class UserController{

static allCategories = async (req: Request, res: Response) => {
  //Get users from database
//   const userRepository = getRepository(User);
//   const users = await userRepository.find({
//     select: ["id", "username", "role"] //We dont want to send the passwords on response
//   });

//   //Send the users object
//   res.send(users);

    const catRepository = getRepository(Category);
    const categories = await catRepository.find({
        select: ["_id", "id", "name", "childrenIds"]
    });

    res.send(categories);
};

static getCategory = async (req: Request, res: Response) => {
  //Get the ID from the url
  const paramid: number = req.params.id;

  //Get the user from database
//   const userRepository = getRepository(User);
//   try {
//     const user = await userRepository.findOneOrFail(id, {
//       select: ["id", "username", "role"] //We dont want to send the password on response
//     });
//     res.send(user);
//   } catch (error) {
//     res.status(404).send("User not found");
//   }

    const catRepository = getRepository(Category);
    try {
        const category = await catRepository.findOneOrFail({id: paramid}, {
            select: ["_id", "id", "name", "childrenIds"]
        });
        res.send(category)
    } catch (error) {
        res.status(404).send("Category not found");
    }
};

static addCategory = async (req: Request, res: Response) => {
  //Get parameters from the body
//   let { username, password, role } = req.body;
//   let user = new User();
//   user.username = username;
//   user.password = password;
//   user.role = role;

    let {id, name, childrenIds} = req.body;
    let category = new Category();

    category.id = id;
    category.name = name;
    category.childrenIds = childrenIds;

    //Validade if the parameters are ok
    const errors = await validate(category);
    if (errors.length > 0) {
        res.status(400).send(errors);
        return;
    }

    //Hash the password, to securely store on DB
    //user.hashPassword();

    //Try to save. If fails, the id is already in use
    const catRepository = getRepository(Category);
    try {
        // before saving, check children
        if (childrenIds.length > 0){
            try{
                const child = await catRepository.findOneOrFail({id: childrenIds}, {
                // select: ["id", "username", "role"] //We dont want to send the password on response
                });
                console.log(child);
            } catch(e1){
                res.status(500).send("error, child non-existent");
                return;
            }
        }
        await catRepository.save(category);
    } catch (e) {
        res.status(409).send("id already in use");
        return;
    }

  //If all ok, send 201 response
  res.status(201).send("Category created");
};

static updateCategory = async (req: Request, res: Response) => {
  //Get the ID from the url
  const id = req.params.id;

  //Get values from the body
  const { username, role } = req.body;

  //Try to find user on database
  const userRepository = getRepository(User);
  let user;
  try {
    user = await userRepository.findOneOrFail(id);
  } catch (error) {
    //If not found, send a 404 response
    res.status(404).send("User not found");
    return;
  }

  //Validate the new values on model
  user.username = username;
  user.role = role;
  const errors = await validate(user);
  if (errors.length > 0) {
    res.status(400).send(errors);
    return;
  }

  //Try to safe, if fails, that means username already in use
  try {
    await userRepository.save(user);
  } catch (e) {
    res.status(409).send("username already in use");
    return;
  }
  //After all send a 204 (no content, but accepted) response
  res.status(204).send();
};

static deleteCategory = async (req: Request, res: Response) => {
  //Get the ID from the url
  const paramid = req.params.id;

  const catRepository = getRepository(Category);
  let category: Category;
  try {
    category = await catRepository.findOneOrFail({id: paramid});
  } catch (error) {
    res.status(404).send("Category not found");
    return;
  }
  catRepository.delete({id: paramid});

  //After all send a 204 (no content, but accepted) response
  res.status(204).send();
};
};

export default UserController;
