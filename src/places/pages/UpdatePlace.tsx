import { useQueryClient } from '@tanstack/react-query';
import { TPlaceDetail, IQueryPlaceData } from 'shared/types/Place';
import { FormEvent, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../shared/context/AppContext';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import { Card, LoadingSpinner } from '../../shared/components/UIElements';
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';

import { QueryKey } from '../../shared/constants';
import usePatchPlace from '../../shared/hooks/usePatchPlace';

function UpdatePlace() {
  const ctx = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);
  const { placeId } = useParams();
  const queryClient = useQueryClient();
  const [identifiedPlace, setIdentifiedPlace] = useState<TPlaceDetail>();

  const state = queryClient.getQueryState([QueryKey.PLACES, ctx.userId]);

  const { mutateAsync: UpdatePlace } = usePatchPlace();

  useEffect(() => {
    if (state !== undefined) {
      if ((state.data as IQueryPlaceData).place.length !== 0) {
        setIdentifiedPlace(
          (state.data as IQueryPlaceData).place.filter(
            (p: TPlaceDetail) => p.id === placeId,
          )[0],
        );
      }
    }
  }, [state, placeId]);

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
    },
    false,
  );

  useEffect(() => {
    if (identifiedPlace) {
      setFormData(
        {
          title: {
            value: identifiedPlace.title,
            isValid: true,
          },
          description: {
            value: identifiedPlace.description,
            isValid: true,
          },
        },
        true,
      );
      setIsLoading(false);
    }
  }, [setFormData, identifiedPlace]);

  // setFormData, identifiedPlace
  if (!identifiedPlace) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }
  // : React.FormEvent<HTMLFormElement>
  const placeUpdateSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await UpdatePlace({
      pid: placeId as string,
      title: formState.inputs.title.value,
      description: formState.inputs.description.value,
      token: ctx.token,
    });
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner asOverlay />
      </div>
    );
  }

  return (
    <form
      className="relative list-none mx-auto p-4 w-11/12 max-w-[40rem] shadow-lg rounded-lg bg-white"
      onSubmit={placeUpdateSubmitHandler}
    >
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="please enter a valid title"
        onInput={inputHandler}
        initialValue={formState.inputs.title.value}
        initialValid={formState.inputs.title.isValid}
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="please enter a valid description at least 5 characters"
        onInput={inputHandler}
        initialValue={formState.inputs.description.value}
        initialValid={formState.inputs.description.isValid}
      />
      <Button type="submit" disabled={!formState.isValid}>
        UPDATE PLACE
      </Button>
    </form>
  );
}

export default UpdatePlace;
