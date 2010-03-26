#!/usr/bin/env ruby

require "rubygems"
require "rest_client"

server = RestClient::Resource.new(ARGV.first)

client_id = server["/"].get.to_s
puts "CLIENT ID: #{client_id}"

loop do
  log = server["/#{client_id}"].get.to_s
  print log
  sleep 1
end
