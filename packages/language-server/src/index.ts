import type { LanguageService } from './models/language-service';
import { HoverService } from './services/hover-service';
import { ValidationService } from './services/validation-service';

export function getLanguageService(): LanguageService {
  const hover = new HoverService();
  const validation = new ValidationService();
  return {
    doHover: hover.doHover.bind(hover),
    doValidation: validation.doValidation.bind(validation),
  };
}
