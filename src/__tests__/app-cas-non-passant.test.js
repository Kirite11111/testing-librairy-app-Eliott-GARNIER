import * as React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

import App from '../app';
import { submitForm } from '../api';

jest.mock('../api', () => ({
  submitForm: jest.fn().mockRejectedValue(new Error('les champs food et drink sont obligatoires')),
}));

  

describe('Integration Test for Multi-Step Form Submission (Cas non-passant)', () => {  
  render(<App />);
  test('completes the form and navigates through the app correctly (Cas non-passant)', async () => {
    submitForm.mockRejectedValue({ message: 'les champs food et drink sont obligatoires' });
    
    // 1-2. Vérifie la présence du titre "Welcome home" sur la Home page
    expect(screen.getByText(/welcome home/i)).toBeInTheDocument();

    // 3. Vérifie la présence du lien "Fill out the form" sur la Home page
    expect(screen.getByRole('link', { name: /fill out the form/i })).toBeInTheDocument();

    // 4. Navigue vers le formulaire
    user.click(screen.getByRole('link', { name: /fill out the form/i }));

    // 5-6. Vérifie la redirection vers Page 1 et la présence du titre "Page 1"
    expect(screen.getByText(/page 1/i)).toBeInTheDocument();

    // 7. Vérifie la présence du lien "Go Home" sur la page 1
    expect(screen.getByRole('link', { name: /go home/i })).toBeInTheDocument();

    // 8. Vérifie la présence du champ "Favorite food"
    expect(screen.getByLabelText(/favorite food/i)).toBeInTheDocument();

    // 9. Rempli le champ "Favorite food"
    user.type(screen.getByLabelText(/favorite food/i), '');

    // 10. Verifie la présence du lien "Next" sur la page 1
    expect(screen.getByRole('link', { name: /next/i })).toBeInTheDocument();

    // 11. Navigue vers Page 2
    user.click(screen.getByText(/next/i));

    // 12-13. Vérifie la présence du titre "Page 2" sur Page 2
    expect(screen.getByText(/page 2/i)).toBeInTheDocument();

    // 14. Vérifie la présence du lien "Go Back" sur la page 2
    expect(screen.getByRole('link', { name: /go back/i })).toBeInTheDocument();

    // 15. Vérifie la présence du champ "Favorite drink"
    expect(screen.getByLabelText(/favorite drink/i)).toBeInTheDocument();

    // 16. Rempli le champ "Favorite drink"
    user.type(screen.getByLabelText(/favorite drink/i), 'Bières');

    // 17. Vérifie la présence du lien "Review" sur la page 2
    expect(screen.getByRole('link', { name: /review/i })).toBeInTheDocument();

    // 18. Navigue vers la page de confirmation
    user.click(screen.getByText(/review/i));

    // 19-20. Vérifie la présence du titre "Confirm" sur la page de confirmation
    expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument();

    // 21-23. Vérifie le contenu des choix confirmés
    expect(screen.getByText(/please confirm your choices/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/favorite food/i)).toHaveTextContent('');
    expect(screen.getByLabelText(/favorite drink/i)).toHaveTextContent('Bières');

    // 24. Vérifie la présence du lien "Go Back" sur la page de confirmation
    expect(screen.getByRole('link', { name: /go back/i })).toBeInTheDocument();

    // 25. Vérifie la présence d'un bouton "Confirm" sur la page de confirmation
    expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument();

    // 26. Confirme les choix
    user.click(screen.getByRole('button', { name: /confirm/i }));

    // 27-28. Vérifier la redirection vers la page d'erreur'
    await waitFor(() => {
      expect(screen.getByText(/oh no. there was an error./i)).toBeInTheDocument();
    });

    // 29. Vérifie la présence du texte "les champs food et drink sont obligatoires" est dans la page d'erreur
    expect(screen.getByText("les champs food et drink sont obligatoires")).toBeInTheDocument();

    // 30. Vérifie la présence du lien "Go Home" sur la page d'erreur
    expect(screen.getByRole('link', { name: /go home/i })).toBeInTheDocument();

    // 31. Vérifie la présence d'un lien "Try again" sur la page d'erreur
    expect(screen.getByRole('link', { name: /try again/i })).toBeInTheDocument();

    // 32. Retourner à la Home page
    user.click(screen.getByText(/try again/i));

    // 33-34. Vérifie la présence d'un texte "Welcome home" sur la Home page
    expect(screen.getByText(/page 1/i)).toBeInTheDocument();

  });
});