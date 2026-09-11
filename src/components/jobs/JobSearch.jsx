import React from 'react'
import { Search, SlidersHorizontal, ArrowUpRightSquareIcon, ChevronDown } from 'lucide-react';

function JobSearch() {
  return (
    <div>
      <div>
        <Search/>
        <p>OPPORTUNITIES</p>
      </div>
      <div>
        <div>
          <h1>Find your next role</h1>
          <p>Discover companies where your work can make an impact.</p>
        </div>
        <div>
          <SlidersHorizontal/> 
          <span>Filter</span>
        </div>
      </div>
      <div>
        <div>
          <input type="text" />
          <Search/>
        </div>
        <div>
          <span>Most Relevent</span>
          <ChevronDown/>
        </div>
      </div>
      <div>
        <div>
          <span>Filter by</span>

          <div>
            <span>Location</span>
            <input type="text" placeholder='AnyWhere' />
          </div>

          <div>
            <span>Job Type</span>
           <select>
  <option value="">All Types</option>
  <option value="full-time">Full-time</option>
  <option value="part-time">Part-time</option>
  <option value="remote">Remote</option>
  <option value="hybrid">Hybrid</option>
</select>
          </div>

          <div>
            <span>Experience</span>
            <select>
  <option value="">Any Experinence</option>
  <option value="Fresher">Fresher</option>
  <option value="Mid-level">Mid-level</option>
  <option value="Senior">Senior</option>
  <option value="Proffessional">Proffessional</option>
</select>
          </div>

         <div>
           <input type="checkbox" />
           <span>Remote Only</span>
         </div>

        <button>Clear Filter</button>
        </div>
        <div>
          <div>
            <p>114 roles found</p>
            <p>Updated a few minutes ago</p>
          </div>
        </div>
      </div>
      <div>
        Fetch all Jobs Later
      </div>
    </div>
  )
}

export default JobSearch
