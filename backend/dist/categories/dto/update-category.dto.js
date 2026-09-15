import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto.js';
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
}
//# sourceMappingURL=update-category.dto.js.map