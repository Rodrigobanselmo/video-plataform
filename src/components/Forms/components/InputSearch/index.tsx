/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, {
  forwardRef,
  ForwardRefRenderFunction,
  ChangeEvent,
  useState,
  useRef,
} from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { IInputProps, IOptions } from './@interfaces';
import {
  FormControl,
  InputContainer,
  InputElement,
  InputRight,
  FormLabel,
  FormErrorMessage,
  SearchView,
  ArrowIcon,
  Line,
  CloseIcon,
} from './styles';
import { useDebounce } from '../../../../hooks/useDebounce';

const mergeRefs = (...refs: any[]) => {
  const filteredRefs = refs.filter(Boolean);
  if (!filteredRefs.length) return null;
  if (filteredRefs.length === 0) return filteredRefs[0];
  return (inst: any) => {
    for (const ref of filteredRefs) {
      if (typeof ref === 'function') {
        ref(inst);
      } else if (ref) {
        ref.current = inst;
      }
    }
  };
};

const InputBase: ForwardRefRenderFunction<HTMLInputElement, IInputProps> = (
  {
    options,
    onSelectItem,
    filter,
    row: Row,
    name,
    label,
    error = null,
    pr = 0,
    ...rest
  },
  ref,
): JSX.Element => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState<IOptions[]>(options);

  const onFilterOptions = async (
    optionsFilter: IOptions[],
    searchFilter: string,
  ): Promise<void> => {
    if (!searchFilter) {
      setData([]);
    } else {
      const filterData = await filter(optionsFilter, searchFilter);
      setData(filterData);
    }
  };

  async function onIsWriting(value: string) {
    await onFilterOptions(options, value);
    setSearch(search);
    setIsLoading(false);
  }

  const { onDebounce, onClearDebounce } = useDebounce(onIsWriting, 500);

  function onChangeInput(event: ChangeEvent<HTMLInputElement>) {
    if (!isLoading) setIsLoading(true);
    onDebounce(event.target.value);
    // console.log(event.target.value);
  }

  function onOpen() {
    return setOpen(true);
  }

  function onClose() {
    return setOpen(false);
  }

  function onCleanInput() {
    if (inputRef?.current) inputRef.current.value = '';
    onClearDebounce();
    setIsLoading(false);
    onClose();
    console.log(23);
  }

  function onHandleSelect(item: IOptions) {
    onSelectItem(item, onClose);
  }

  const isEmpty = data.length === 0;

  return (
    <ClickAwayListener onClickAway={onClose}>
      <FormControl isInvalid={!!error}>
        {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}

        <InputContainer>
          <InputElement
            style={{ paddingRight: `calc(${pr} + 1rem)` }}
            name={name}
            ref={mergeRefs(inputRef, ref)}
            placeholder="Pesquisar..."
            id={name}
            onFocus={onOpen}
            onChange={onChangeInput}
            {...rest}
          />
          <InputRight>
            {search && <CloseIcon onClick={onCleanInput} fontSize="inherit" />}
            <Line />
            <ArrowIcon onClick={() => setOpen(!open)} fontSize="inherit" />
          </InputRight>
          {open &&
            (!isLoading && !isEmpty ? (
              <SearchView>
                {data.map((item) => {
                  return (
                    <Row
                      key={item?.uid}
                      onClick={() => onHandleSelect(item)}
                      item={item}
                      // onHandleSelect={onHandleSelect}
                    />
                  );
                })}
              </SearchView>
            ) : isLoading ? (
              <SearchView empty>Carregando...</SearchView>
            ) : (
              <SearchView empty>Nenhuma opção...</SearchView>
            ))}
        </InputContainer>

        {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
      </FormControl>
    </ClickAwayListener>
  );
};

export const InputSearch = forwardRef(InputBase);
