/* eslint-disable react/jsx-curly-newline */
import React, { useEffect, useRef, useState } from 'react';
import { SubmitHandler, FormHandles } from '@unform/core';
import * as Yup from 'yup';
import styled from 'styled-components';
import EmailIcon from '@material-ui/icons/Email';
import { useNotification } from '../../../context/NotificationContext';
import { useLoaderDashboard } from '../../../context/LoadDashContext';
import { useAuth } from '../../../context/AuthContext';
import {
  InputEnd,
  InputUnform,
} from '../../../components/Main/MuiHelpers/Input';
import { FormContainer, InputContainer } from './styles';
import { ButtonForm } from '../../../components/Dashboard/Components/Form/comp';
import { db } from '../../../lib/firebase.prod';
import { HeaderComponent } from '../../../components/Blocks/Header';

const Notifications: React.FC = () => {
  const { setLoaderDash } = useLoaderDashboard();
  const formRef = useRef<FormHandles>(null);
  const notification = useNotification();
  const { currentUser } = useAuth();
  const [data, setData] = useState<any>({});

  const triggers = [
    {
      label:
        'Informe o e-mail que irá receber notificações toda vez que um usuários que realizar uma nova compra ou reembolso',
      trigger: 'Criação de nova fatura',
      ref: 'statement',
      field: 'statement',
    },
    {
      label:
        'Informe o e-mail que irá receber notificações toda vez que um novo usuário se cadastrar na plataforma',
      trigger: 'Cadastro de novo usuário',
      ref: 'users',
      field: 'new_user',
    },
    {
      label:
        'Informe o e-mail que irá receber notificações toda vez que um usuário fizer uma avaliação de um curso',
      trigger: 'Nova avaliação de curso',
      field: 'reviews',
      ref: 'reviews',
    },
    {
      label:
        'Informe o e-mail que irá receber notificações toda vez que um usuário receber o certificado por finalizar um curso que não necessita de assinatura digital',
      trigger: 'Novo certificado gerado',
      ref: 'certifications',
      field: 'certifications_no_signature',
    },
    {
      label:
        'Informe o e-mail que irá receber o certificado para ser assinado digitalmente toda vez que um usuário finalizar um curso',
      trigger: 'Novo certificado para assinatura digital',
      ref: 'certifications',
      field: 'certifications_signature',
      isRequired: true,
    },
    {
      label:
        'Informe o e-mail que irá receber notificações toda vez que um usuário fizer alguma pergunta ao suporte',
      trigger: 'Nova pergunta ao suporte',
      ref: 'notifications',
      field: 'support_notifications',
      isRequired: true,
    },
  ];

  useEffect(() => {
    const onGetEmails = async (): Promise<void> => {
      const emailsNotifications = await db
        .collection('notifications')
        .doc('emails')
        .get();

      if (emailsNotifications.exists) {
        const emailsData = emailsNotifications.data() as any[];
        // Object.entries(emailsData).map(([field, email]) => {
        //   if (formRef?.current) formRef.current?.setFieldValue(field, email);
        // });
        setData(emailsData);
      }
    };

    onGetEmails();

    setLoaderDash(false);
  }, []);

  const yupCompany = {} as Record<string, any>;

  triggers.map((trigger) => {
    if (trigger.isRequired)
      yupCompany[trigger.field] = Yup.string()
        .email('E-mail com formatação inválida.')
        .required('Campo não pode estar em branco.');
    if (!trigger.isRequired)
      yupCompany[trigger.field] = Yup.string().email(
        'E-mail com formatação inválida.',
      );
  });

  const validation = Yup.object({
    ...yupCompany,
  });

  const handleSubmit: SubmitHandler<Record<string, any>> = React.useCallback(
    async (formData) => {
      formRef?.current?.setErrors({});
      try {
        await validation.validate(formData, { abortEarly: false });
        db.collection('notifications').doc('emails').set(formData);
      } catch (error) {
        const errors = {} as any;
        error?.inner?.forEach((err: any) => {
          errors[err.path] = err.message;
        });
        formRef.current?.setErrors(errors);
      }
    },
    [],
  );

  // const onChangeAnswerEmail = (
  //   event: React.ChangeEvent<HTMLInputElement>,
  //   index: number,
  // ): void => {
  //   console.log('');
  // };
  console.log(data);
  return (
    <FormContainer
      noValidate
      key={data?.certifications_signature}
      ref={formRef}
      onSubmit={handleSubmit}
    >
      <HeaderComponent
        title="Cadastro de e-mails para Notificações"
        subTitle={['admin', 'notificações', 'email']}
        icon={<EmailIcon />}
      />
      {triggers.map((trigger, index) => {
        return (
          <InputContainer key={trigger.label}>
            <p>{trigger.label}</p>
            <InputUnform
              width="100%"
              defaultValue={(data && data[trigger.field]) || ''}
              name={trigger.field}
              labelWidth={45}
              label="E-mail"
              variant="outlined"
            />
            {/* <InputUnform
              label="Email"
              icon="Info"
              width="100%"
              variant="outlined"
              value=""
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onChangeAnswerEmail(e, index)
              }
              title="Aqui você deve informar o email que ficará responsavel por receber notificações de duvidades dos alunos sobre o curso"
              status="Normal"
              validation
            /> */}
          </InputContainer>
        );
      })}
      <ButtonForm type="submit" primary="true" style={{ width: 'fit-content' }}>
        Salvar
      </ButtonForm>
    </FormContainer>
  );
};

export default Notifications;
