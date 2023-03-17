import 'jest';
import MailService from '../MailService';

describe('Testing Mail Service', () => {
    let mailService = new MailService();
    it('It should have a send function', () => {
        expect(typeof mailService.send).toBe('function');
    });
});
