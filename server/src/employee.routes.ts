import * as express from "express";
import * as mongodb from "mongodb";
import { collections } from "./database";

export const employeeRouter = express.Router();
employeeRouter.use(express.json());

/**
 * @swagger
 * /employees:
 *  get:
 *    description: Use to get all employee list
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: A error response
 */
employeeRouter.get("/", async (_req, res) => {
    try {
        const employees = await collections.employees.find({}).toArray();
        res.status(200).send(employees);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

/**
 * @swagger
 * employees/id:
 *  get:
 *    description: Use to get specific employee
 *    parameters:
 *      name: id
 *      in: path
 *      description: Id of Employee
 *      required: false
 *      explode: true
 *      schema:
 *          type: Intger
 *    responses:
 *      '200':
 *        description: A successful response
 *      '404':
 *        description: A error response
 */
employeeRouter.get("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new mongodb.ObjectId(id) };
        const employee = await collections.employees.findOne(query);

        if (employee) {
            res.status(200).send(employee);
        } else {
            res.status(404).send(`Failed to find an employee: ID ${id}`);
        }
    } catch (error) {
        res.status(404).send(`Failed to find an employee: ID ${req?.params?.id}`);
    }
});

/**
 * @swagger
 * /employees:
 *  post:
 *    description: Use to register employee
 *    responses:
 *      '201':
 *        description: A successful response
 *      '500':
 *        description: A error response
 */
employeeRouter.post("/", async (req, res) => {
    try {
        const employee = req.body;
        const result = await collections.employees.insertOne(employee);

        if (result.acknowledged) {
            res.status(201).send(`Created a new employee: ID ${result.insertedId}.`);
        } else {
            res.status(500).send("Failed to create a new employee.");
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
});


/**
 * @swagger
 * /employees/id:
 *  put:
 *    description: Use to update specific employee
 *    parameters:
 *      'id' : 
 *        description: Id of Employee
 *    responses:
 *      '200':
 *        description: A successful response
 *      '404':
 *        description: A error response
 */
employeeRouter.put("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const employee = req.body;
        const query = { _id: new mongodb.ObjectId(id) };
        const result = await collections.employees.updateOne(query, { $set: employee });

        if (result && result.matchedCount) {
            res.status(200).send(`Updated an employee: ID ${id}.`);
        } else if (!result.matchedCount) {
            res.status(404).send(`Failed to find an employee: ID ${id}`);
        } else {
            res.status(304).send(`Failed to update an employee: ID ${id}`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});

/**
 * @swagger
 * /employees/id:
 *  delete:
 *    description: Use to delete employee
 *    parameters:
 *      'id' : 
 *        description: Id of Employee
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: A error response
 */

employeeRouter.delete("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new mongodb.ObjectId(id) };
        const result = await collections.employees.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Removed an employee: ID ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove an employee: ID ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Failed to find an employee: ID ${id}`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});
