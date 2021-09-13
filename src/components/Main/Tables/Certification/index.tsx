/* eslint-disable react/jsx-curly-newline */
/* eslint-disable no-plusplus */
/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
import React, { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import styled, { css } from 'styled-components';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import Collapse from '@material-ui/core/Collapse';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import GetAppIcon from '@material-ui/icons/GetApp';
import PublishIcon from '@material-ui/icons/Publish';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Icons } from '../../../Icons/iconsDashboard';
import { AvatarView } from '../../Avatar';
import { BootstrapTooltip } from '../../MuiHelpers/Tooltip';
// import { FilterComponent } from '../../Table/comp';
import { LoadMoreTableCells, LoadSkeleton } from '../elements/LoadMore';
import { LoadTable } from '../elements/LoadTable';
import { MissingData } from '../elements/MissingData';
import { FilterComponent } from '../elements/Filter';
import { useDeleteUsers } from '../../../../services/hooks/del/useDeleteUsers';
import { IconLoadButton } from '../elements/IconLoadButton';
import { PERMISSIONS } from '../../../../constants/geral';
import { DateProvider } from '../../../../helpers/DateProvider/implementation';
import { useDownloadCertification } from '../../../../services/hooks/http/useDownloadCertification';
import { db, st } from '../../../../lib/firebase.prod';
import { useUploadCertification } from '../../../../services/hooks/http/useUploadCertification';

const ContainerTable = styled.div``;

const Table = styled.div``;

const TableHeader = styled.div`
  display: grid;
  margin-bottom: 0px;
  grid-template-columns: 3fr 1fr 1fr 1fr;
  padding: 0rem 1.75rem;
  align-items: center;
`;

const TableHComponent = styled.div`
  color: ${({ theme }) => theme.palette.text.secondary};
  font-weight: 400;
  padding: 0.25rem 0.25rem;
  text-align: left;
  line-height: 1.5rem;
`;

const TableBody = styled.div`
  max-height: 400px;
  overflow-y: auto;
  padding: 5px;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 1fr;
  flex-shrink: 0;
  grid-template-rows: fit-content fit-content;
  border-radius: 0.25rem;
  -webkit-box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.2);
  box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.2);
  background-color: ${({ theme }) => theme.palette.background.paper};
  margin-bottom: 10px;
  padding: 0.5rem 0.75rem;
  align-items: center;
  /* align-self: center; */
  color: ${({ theme }) => theme.palette.text.primary};
`;

const TableBComponent = styled.div`
  padding: 0rem 0.25rem;
`;

const UserComponent = styled.div`
  display: grid;
  grid-template-columns: 60px 1fr;
  gap: 0 5px;
  align-self: center;
  align-items: center;
  align-content: center;
  /* cursor: pointer; */

  span.name {
    align-self: flex-end;
    font-size: 14px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  span.email {
    margin-bottom: auto;
    font-size: 13px;
    opacity: 0.7;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

interface ICertification {
  email: string;
  name: string;
  validSignature: string;
  fileURL: string;
  userId: string;
  studentId: string;
  cursoName: string;
  finishedDate: string;
  id: string;
}

// interface IActiveUsers {
//   data: IUserChat[];
//   answer: IUserChat[];
// }

interface ITable {
  data: ICertification[];
  isLoading: boolean;
  onClickRow: (uid: string) => void;
}

const Certification = styled.div`
  display: flex;
  width: fit-content;
  min-width: fit-content;
  gap: 10px;
  cursor: pointer;

  p {
    width: fit-content;
    min-width: fit-content;
  }

  svg {
    color: #999;
    font-size: 1.1rem;
  }
`;

interface IUpload {
  userId: string;
  id: string;
  file: FileList;
}

export const CertificationTable = ({
  isLoading,
  data,
  onClickRow,
}: ITable): JSX.Element => {
  const DATA = data;
  const dateProvider = new DateProvider();

  const downloadCertificate = useDownloadCertification();
  const uploadCertificate = useUploadCertification();

  const handleDownloadCertificate = (studentId: string): void => {
    console.log(`studentId`, studentId);
    if (downloadCertificate.isLoading) return;
    downloadCertificate.mutateAsync({
      isAdmin: true,
      certificationId: studentId,
    });
  };

  const onInputFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    certification: Pick<ICertification, 'id' | 'userId'>,
  ): Promise<void> => {
    if (event.target.files && event.target.files[0]) {
      // onHandleSelect(event.target.files[0]);
      const mutateData = {
        file: event.target.files[0],
        userId: certification.userId,
        id: certification.id,
      };

      uploadCertificate.mutateAsync(mutateData);
    }
  };

  function onUploadFile(): void {
    if (uploadCertificate.isLoading) return;
    document.getElementById('newFileLabelUploadCertification')?.click();
  }

  return (
    <ContainerTable>
      {!isLoading ? (
        DATA.length > 0 ? (
          <>
            <Table>
              <TableHeader>
                <TableHComponent>Aluno</TableHComponent>
                <TableHComponent>Criação</TableHComponent>
                <TableHComponent>Download</TableHComponent>
                <TableHComponent>Upload</TableHComponent>
              </TableHeader>
              <TableBody>
                {DATA.map((item) => {
                  return (
                    <TableRow
                      // onClick={() => onClickRow(item.studentId)}
                      key={item.id}
                    >
                      <TableBComponent>
                        <UserComponent>
                          <AvatarView
                            style={{ gridRow: '1 / 3', margin: '-5px 0' }}
                            user={item}
                          />
                          <span className="name">
                            {item?.name ? item.name : '------------'}
                          </span>
                          <span className="email">
                            {item?.email ? item.email : '------------'}
                          </span>
                        </UserComponent>
                      </TableBComponent>

                      <TableBComponent>
                        <span>
                          {item?.finishedDate
                            ? dateProvider
                                .format()
                                .timeAgo(item.finishedDate) || '------------'
                            : '------------'}
                        </span>
                      </TableBComponent>

                      <TableBComponent>
                        <Certification
                          onClick={() =>
                            handleDownloadCertificate(item.studentId)
                          }
                        >
                          {downloadCertificate.isLoading ? (
                            <CircularProgress size={18} />
                          ) : (
                            <GetAppIcon />
                          )}
                          <p>Baixar Modelo</p>
                        </Certification>
                      </TableBComponent>

                      <TableBComponent>
                        <Certification onClick={onUploadFile}>
                          <input
                            style={{ display: 'none' }}
                            accept="*/pdf"
                            type="file"
                            id="newFileLabelUploadCertification"
                            onChange={(e) =>
                              onInputFileChange(e, {
                                id: item.id,
                                userId: item.userId,
                              })
                            }
                          />
                          {uploadCertificate.isLoading ? (
                            <CircularProgress size={18} />
                          ) : (
                            <PublishIcon />
                          )}
                          <p>Enviar Certificado</p>
                        </Certification>
                      </TableBComponent>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </>
        ) : (
          <MissingData text="Nenhuma certificado pendente de assinatura" />
        )
      ) : (
        <LoadTable rows={5} columns={2} />
      )}
    </ContainerTable>
  );
};
