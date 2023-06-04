import { Article } from './article';
import { User } from './user';
export interface Loan {
    id?: string;
    person?: User;
    monitor?: User;
    article?: Article;
    quantityArticle?: number;
    startDate: Date;
    endDate: Date;
    returned: boolean;
  }
  