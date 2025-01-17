import { useMutation } from '@apollo/client';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Form from './styles/Form';
import useForm from '../lib/useForm';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY, SIGNIN_MUTATION } from '../graphql/users';

export default function SignIn() {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
    password: '',
  });

  const [signin, { data, loading }] = useMutation(SIGNIN_MUTATION, {
    variables: inputs,
    // refectch the currently logged in user
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });

  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault(); // stop the form from submitting
    const res = await signin();
    const loginSuccess =
      res?.data?.authenticateUserWithPassword?.__typename ===
      'UserAuthenticationWithPasswordSuccess';

    if (loginSuccess) {
      resetForm();
      // Go to the account page!
      if (router.pathname === '/signin') {
        router.push({ pathname: 'account' });
      }
    } else {
      resetForm(['password']);
    }
    // Send the email and password to the graphqlAPI
  }

  const renderError =
    data?.authenticateUserWithPassword.__typename ===
    'UserAuthenticationWithPasswordFailure' ? (
      <Error error={data?.authenticateUserWithPassword} />
    ) : null;

  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <h2>Sign In</h2>
      {renderError}
      <fieldset aria-disabled={loading}>
        <label htmlFor="email">
          Email
          <input
            type="email"
            name="email"
            placeholder="Your Email Address"
            autoComplete="email"
            value={inputs.email}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="password">
          Password
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="password"
            value={inputs.password}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Sign In!</button>
        <p>
          🤷 <Link href="/reset">or reset your password...</Link>
        </p>
      </fieldset>
    </Form>
  );
}
