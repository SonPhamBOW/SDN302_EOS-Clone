import { Router } from "express";
import * as questionController from "../controller/question.controller.js";
const questionRouter = Router();

questionRouter.route("/questions").get(questionController.getQuestions);
questionRouter.route("/questions").post(questionController.createQuestion);
questionRouter.route("/questions/:id").put(questionController.updateQuestion);
questionRouter.route("/questions/:id").delete(questionController.deleteQuestion);

export default questionRouter;
