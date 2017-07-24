-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Jul 24, 2017 at 04:24 PM
-- Server version: 10.1.16-MariaDB
-- PHP Version: 5.6.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `stripped`
--

-- --------------------------------------------------------

--
-- Table structure for table `easy_api_tokens`
--

CREATE TABLE `easy_api_tokens` (
  `id` int(11) NOT NULL,
  `token` text NOT NULL,
  `enabled` tinyint(2) NOT NULL DEFAULT '1',
  `uses` int(11) NOT NULL DEFAULT '0',
  `last_use_ip` varchar(255) NOT NULL,
  `last_use_time` datetime NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `easy_api_tokens`
--

INSERT INTO `easy_api_tokens` (`id`, `token`, `enabled`, `uses`, `last_use_ip`, `last_use_time`, `user_id`, `created_at`, `updated_at`) VALUES
(1, '891afcc4d590d8d7d2ab9ae980ab5f832efc9056', 1, 5, '10.0.0.80', '2017-07-24 07:22:57', 37, '2017-07-24 07:15:31', '2017-07-24 07:15:31'),
(2, 'e6a43c2d7997997b51f35293032fd89457263c6e', 1, 4, '10.0.0.80', '2017-07-24 07:24:26', 37, '2017-07-24 07:23:06', '2017-07-24 07:23:06');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `easy_api_tokens`
--
ALTER TABLE `easy_api_tokens`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `easy_api_tokens`
--
ALTER TABLE `easy_api_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
