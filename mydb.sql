--
-- PostgreSQL database dump
--

\restrict HOatfgddjqpJcO4ZAz6DeqlBO0yxCbNAyl3dy8GG1qeBzdb8qNZfTfCM7pPTHPW

-- Dumped from database version 16.11 (Debian 16.11-1.pgdg13+1)
-- Dumped by pg_dump version 16.11 (Debian 16.11-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: airports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.airports (
    id text NOT NULL,
    type text,
    name text,
    code text,
    city text,
    city_name text,
    region_name text,
    country text,
    country_name text,
    country_name_short text,
    photo_uri text,
    distance_value double precision,
    distance_unit text,
    parent text
);


ALTER TABLE public.airports OWNER TO postgres;

--
-- Name: attractions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attractions (
    id integer NOT NULL,
    attraction_name text,
    attraction_slug text NOT NULL,
    additional_info text,
    cancellation_policy boolean DEFAULT false,
    images text,
    price numeric,
    whats_included text,
    country text,
    city text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.attractions OWNER TO postgres;

--
-- Name: attractions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.attractions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.attractions_id_seq OWNER TO postgres;

--
-- Name: attractions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.attractions_id_seq OWNED BY public.attractions.id;


--
-- Name: flights; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.flights (
    id integer NOT NULL,
    flight_name text,
    arrival_airport text,
    departure_airport text,
    arrival_time timestamp without time zone,
    departure_time timestamp without time zone,
    flight_logo text,
    fare numeric,
    country text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    location text
);


ALTER TABLE public.flights OWNER TO postgres;

--
-- Name: flights_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.flights_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.flights_id_seq OWNER TO postgres;

--
-- Name: flights_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.flights_id_seq OWNED BY public.flights.id;


--
-- Name: attractions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attractions ALTER COLUMN id SET DEFAULT nextval('public.attractions_id_seq'::regclass);


--
-- Name: flights id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flights ALTER COLUMN id SET DEFAULT nextval('public.flights_id_seq'::regclass);


--
-- Data for Name: airports; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.airports (id, type, name, code, city, city_name, region_name, country, country_name, country_name_short, photo_uri, distance_value, distance_unit, parent) FROM stdin;
\.


--
-- Data for Name: attractions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attractions (id, attraction_name, attraction_slug, additional_info, cancellation_policy, images, price, whats_included, country, city, created_at) FROM stdin;
4	New York La Guardia Airport to Baltimore Arrival Private Transfer	prhgvq3bncxq-new-york-la-guardia-airport-to-baltimore-arrival-private-transfer	Infants and small children can ride in a pram or stroller\n\nService animals allowed\n\nPublic transportation options are available nearby\n\nSpecialized infant seats are available\n\nSuitable for all physical fitness levels\n\nIMPORTANT NOTE: Please advise us of the amount of luggage you have, airline name, flight number, and airport terminal number in the Special Requirements field on booking.\n\nARRIVAL TRANSFER. After you have collected your luggage, proceed through customs and into the arrival hall. Your driver will be waiting in the arrival hall at the DRIVER MEETING POINT/LIMO SERVICE, holding a signboard with the lead traveler’s name on it.\n\nNot wheelchair accessible\n\nPlease bring your ticket with you to the attraction.\n\nBe aware that operators may cancel for unforeseen reasons.\n\nYou need to be 18 years or older to book.	t	https://r-xx.bstatic.com/xdata/images/xphoto/300x320/396002323.jpg?k=f78118ad41846eb053913d15560930e56c1ee0abc6dedb23b43b583253de318c&o=	804.39	{"Private transportation","All Fees and Taxes","Air-conditioned vehicle"}	us	Baltimore, MD	2026-01-13 08:05:02.301871
5	Amsterdam Drugs Tour (Self-Guided, Amsterdam City Centre)	prx8uuqpnfxl-amsterdam-drugs-tour-self-guided-amsterdam-city-centre	Wheelchair accessible\n\nInfants and small children can ride in a pram or stroller\n\nService animals allowed\n\nPublic transportation options are available nearby\n\nTransportation options are wheelchair accessible\n\nAll areas and surfaces are wheelchair accessible\n\nSuitable for all physical fitness levels\n\nPlease bring your ticket with you to the attraction.\n\nBe aware that operators may cancel for unforeseen reasons.\n\nYou need to be 18 years or older to book. Children must be accompanied by an adult.	t	https://r-xx.bstatic.com/xdata/images/xphoto/300x320/134539112.jpg?k=6a6e4e4934c1effa12b9f091016c3181cb579c0a9d4e6c8076ac1f50c47b28e6&o=	11.64	{"digital tour/download"}	nl	Amsterdam	2026-01-13 09:11:36.608473
\.


--
-- Data for Name: flights; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.flights (id, flight_name, arrival_airport, departure_airport, arrival_time, departure_time, flight_logo, fare, country, created_at, location) FROM stdin;
10	Emirates Airlines	Dubai International Airport	Schiphol Airport	2026-01-14 07:30:00	2026-01-13 21:45:00	https://r-xx.bstatic.com/data/airlines_logo/EK.png	5769	Netherlands	2026-01-13 09:56:15.197946	Amsterdam
11	Qatar Airways	Dubai International Airport	Schiphol Airport	2026-01-14 10:25:00	2026-01-13 21:50:00	https://r-xx.bstatic.com/data/airlines_logo/QR.png	4874	Netherlands	2026-01-13 09:56:19.590525	Amsterdam
12	Qatar Airways	Dubai International Airport	Schiphol Airport	2026-01-14 11:40:00	2026-01-13 21:50:00	https://r-xx.bstatic.com/data/airlines_logo/QR.png	4874	Netherlands	2026-01-13 09:56:23.391244	Amsterdam
13	\N	\N	\N	\N	\N	\N	\N	\N	2026-01-13 09:56:44.80625	Amsterdam
14	British Airways	Dubai International Airport	Schiphol Airport	2026-01-14 08:30:00	2026-01-13 19:35:00	https://r-xx.bstatic.com/data/airlines_logo/BA.png	5551	Netherlands	2026-01-13 09:56:54.77747	Amsterdam
\.


--
-- Name: attractions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.attractions_id_seq', 6, true);


--
-- Name: flights_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.flights_id_seq', 14, true);


--
-- Name: airports airports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.airports
    ADD CONSTRAINT airports_pkey PRIMARY KEY (id);


--
-- Name: attractions attractions_attraction_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attractions
    ADD CONSTRAINT attractions_attraction_slug_key UNIQUE (attraction_slug);


--
-- Name: attractions attractions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attractions
    ADD CONSTRAINT attractions_pkey PRIMARY KEY (id);


--
-- Name: flights flights_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flights
    ADD CONSTRAINT flights_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

\unrestrict HOatfgddjqpJcO4ZAz6DeqlBO0yxCbNAyl3dy8GG1qeBzdb8qNZfTfCM7pPTHPW

