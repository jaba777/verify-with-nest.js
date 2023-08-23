enum CarModel {
  BMW = 'BMW',
  MERCEDES = 'MERCEDES',
  AUDI = 'AUDI',
}

enum CarColor {
  WHITE = 'white',
  BLACK = 'black',
  RED = 'red',
}

export class CreateCarDto {
  model: CarModel;
  color: CarColor;
  describe: string;
  age: number;
}

