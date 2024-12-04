import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function StartsWithHash(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'startsWithHash',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'string' && value.startsWith('#');
        },
        defaultMessage(args: ValidationArguments) {
          return `The property ${args.property} must start with a '#' character`;
        },
      },
    });
  };
}
