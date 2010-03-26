#!/usr/bin/env ruby

require "net/http"

Net::HTTP.start("localhost", 8000) do |http|
  http.get("/") do |body|
    puts "BODY: #{body}"
  end
end
