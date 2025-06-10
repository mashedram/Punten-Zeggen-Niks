export class ChangeOutOfRangeError extends Error {
  constructor(step: number, length: number) {
    super(
      `Step ${step} is out of range, it should be no larger than ${length}`,
    );
  }
}
