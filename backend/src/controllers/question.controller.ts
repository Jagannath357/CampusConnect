import { Response } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import { AcademicQuestion } from '../models/AcademicQuestion.js';
import { AcademicAnswer } from '../models/AcademicAnswer.js';

export const getQuestions = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { category, subjectCode, tag, search, page = '1', limit = '10' } = req.query;

    const query: any = { isModerated: false };

    if (category) {
      query.subjectCategory = category;
    }

    if (subjectCode) {
      query.subjectCode = (subjectCode as string).toUpperCase();
    }

    if (tag) {
      query.tags = { $in: [tag] };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { subjectCode: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search as string, 'i')] } },
      ];
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const total = await AcademicQuestion.countDocuments(query);
    const questions = await AcademicQuestion.find(query)
      .populate('authorId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      message: 'Questions retrieved.',
      data: questions,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve questions.',
    });
  }
};

export const getQuestionById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const question = await AcademicQuestion.findOne({ _id: id, isModerated: false }).populate(
      'authorId',
      'name email'
    );

    if (!question) {
      res.status(404).json({
        success: false,
        message: 'Question not found.',
      });
      return;
    }

    const answers = await AcademicAnswer.find({ questionId: id, isModerated: false })
      .populate('authorId', 'name email')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      message: 'Question details retrieved.',
      data: {
        question,
        answers,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve question details.',
    });
  }
};

export const createQuestion = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { title, description, subjectCode, subjectCategory, tags } = req.body;

    const question = await AcademicQuestion.create({
      authorId: req.user?.userId,
      title,
      description,
      subjectCode: subjectCode.toUpperCase(),
      subjectCategory,
      tags: tags || [],
      answerCount: 0,
      isModerated: false,
    });

    res.status(201).json({
      success: true,
      message: 'Academic question posted successfully.',
      data: question,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to post question.',
    });
  }
};

export const createAnswer = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { questionId } = req.params;
    const { content } = req.body;

    const question = await AcademicQuestion.findById(questionId);
    if (!question || question.isModerated) {
      res.status(404).json({
        success: false,
        message: 'Question not found.',
      });
      return;
    }

    const answer = await AcademicAnswer.create({
      questionId,
      authorId: req.user?.userId,
      content,
      isModerated: false,
    });

    await AcademicQuestion.updateOne({ _id: questionId }, { $inc: { answerCount: 1 } });

    res.status(201).json({
      success: true,
      message: 'Answer posted successfully.',
      data: answer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to post answer.',
    });
  }
};

export const deleteQuestion = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const question = await AcademicQuestion.findById(id);

    if (!question) {
      res.status(404).json({
        success: false,
        message: 'Question not found.',
      });
      return;
    }

    if (question.authorId.toString() !== req.user?.userId && req.user?.role !== 'ADMIN') {
      res.status(403).json({
        success: false,
        message: 'Forbidden: You do not own this question.',
      });
      return;
    }

    await AcademicQuestion.deleteOne({ _id: id });
    await AcademicAnswer.deleteMany({ questionId: id });

    res.status(200).json({
      success: true,
      message: 'Question deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete question.',
    });
  }
};
