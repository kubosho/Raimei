import { Button, Text, TextField } from '@radix-ui/themes';
import { Form } from '@remix-run/react';

interface Props {
  action: string;
}

export default function LoginForm({ action }: Props): JSX.Element {
  return (
    <Form action={action} method="post">
      <div className="flex flex-col gap-4">
        <TextField.Root
          type="email"
          name="email"
          id="email"
          defaultValue=""
          autoCapitalize="none"
          autoCorrect="off"
          autoComplete="email"
          spellCheck={false}
        >
          <TextField.Slot>
            <label htmlFor="email">
              <Text>Email</Text>
            </label>
          </TextField.Slot>
        </TextField.Root>
        <TextField.Root type="password" name="password" id="password" defaultValue="" autoComplete="current-password">
          <TextField.Slot>
            <label htmlFor="passward">
              <Text>Password</Text>
            </label>
          </TextField.Slot>
        </TextField.Root>
        <Button type="submit">Login</Button>
      </div>
    </Form>
  );
}
