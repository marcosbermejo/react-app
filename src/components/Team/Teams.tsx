import axios from "axios";

import React, { useContext, useEffect, useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'

import { Avatar, Stack } from '@mui/material'
import { HeaderContext } from '../../contexts/HeaderContext'
import { sliceEvents, EventContentArg, SlotLaneContentArg } from '@fullcalendar/core'
import { DateProfile, ViewProps } from '@fullcalendar/core/internal'

import styled from "@emotion/styled";
import { ApiListResponse } from "../../interfaces/ApiResponse";
import { parse } from "date-fns";
import Team from "../../interfaces/Team";
import Match from "../../interfaces/Match";


export const StyleWrapper = styled.div`
  .fc-event-main {
    display: flex;
    justify-content: center;
  }
`

function renderEventContent(event: EventContentArg) {
  return (
    <>
      <Avatar
        alt={event.event.extendedProps.homeTeamName}
        src={event.event.extendedProps.homeTeamImage}
        sx={{ width: 32, height: 32 }}
      />
      <Avatar
        alt={event.event.extendedProps.homeTeamName}
        src={event.event.extendedProps.homeTeamImage}
        sx={{ width: 32, height: 32 }}
      />
    </>
  )
}

export default function Teams() {
  const [matches, setMatches] = useState<Match[]>([])
  const { updateTitle, updatePrevious } = useContext(HeaderContext)
  const calendarRef = useRef<FullCalendar>(null);

  const events = matches
    .filter(match => match.awayTeam && match.homeTeam)
    .map(match => ({
      id: match.id,
      date: match.date,
      extendedProps: {
        homeTeamName: match.homeTeam?.name,
        awayTeamName: match.awayTeam?.name,
        homeTeamImage: match.homeTeam?.image,
        awayTeamImage: match.awayTeam?.image,
      }
    }))

  useEffect(() => {
    updateTitle('Calendari')
    updatePrevious('')

    axios
      .get<ApiListResponse>('')
      .then(({ data: { data, included } }) => {

        const findTeam = (teamId: string) => {
          const data = included.find(entity => entity.type === 'team' && entity.id === teamId)
          return data ? {
            id: data.id,
            name: data.attributes.name,
            image: data.meta.avatar.large
          } as Team : undefined
        }

        setMatches(data.map(({ id, attributes, meta }) => ({
          id: id,
          finished: attributes.finished,
          facility: '',
          groupName: '',
          roundName: '',
          date: parse(`${attributes.date} Z`, 'yyyy-MM-dd HH:mm:ss X', new Date()),
          homeTeam: findTeam(meta.home_team),
          awayTeam: findTeam(meta.away_team),
        })))
      })

  }, [])

  return (
    <Stack spacing={2} pb={7} pt={2} flexGrow={1} bgcolor={'white'}>
      <StyleWrapper>
        <FullCalendar
          views={{
            timeGridFourDay: {
              type: 'timeGrid',
              duration: { days: 2 },
              buttonText: '4 day',
            }
          }}
          height={'auto'}
          ref={calendarRef}
          plugins={[timeGridPlugin]}
          eventContent={renderEventContent}
          initialView="timeGridFourDay"
          eventDisplay='list-item'
          events={events}
          slotMinTime={'08:00'}
          slotMaxTime={'22:00'}
          allDaySlot={false}

        />
      </StyleWrapper>

    </Stack>
  )
}