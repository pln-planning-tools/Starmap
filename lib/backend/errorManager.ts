import { StarMapsError } from '../types';

export class ErrorManager {
  errors: StarMapsError[];
  constructor() {
    this.errors = [];
  }
  addError(error: StarMapsError) {
    this.errors.push(error);
  }
  flushErrors() {
    const errors = this.errors.concat();
    this.clearErrors();
    return errors;
  }
  clearErrors() {
    this.errors = [];
  }
}

export const errorManager = new ErrorManager();
