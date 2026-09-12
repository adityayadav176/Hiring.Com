import { ArrowUpLeft, ChevronRight, CircleCheck, LaptopIcon, LockKeyholeIcon, LogOut, Monitor, Recycle, ShieldCheck, ShieldIcon, Smartphone, TrashIcon, TriangleAlert } from 'lucide-react'
import React from 'react'

export default function Settings() {
  return (
    <div>
      <div>
        <h1>Settings</h1>
        <p>Manage Your account, security and active sessions.</p>
      </div>
      <div>
        <span>Account</span>
        <div>
          <div>
            <div>
              <ShieldCheck/>
            </div>
            <div>
              <div>
                <div>
                <h2>Account Verification</h2>
                <span>
                  <CircleCheck/>
                </span>
              </div>
              <button>View <ChevronRight/></button>
              </div>
              <p>Verify your account to build trust on Peer.Hiring</p>
            </div>
          </div>
          <span>--------------------------------------------------------------------</span>
          <div>
            <div>
              <Recycle/>
            </div>
            <div>
              <div>
                <h2>Recycle Bin</h2>
                <p>Recover Deleted Items before permanent deletion</p>
              </div>
              <div>
                <button>RecycleBin</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <span>SECURITY</span>
        <div>
          <div>
            <LockKeyholeIcon/>
          </div>
          <div>
            <div>
              <div>
                <h2>Two-Factor Authentication</h2>
                <span>Enabled</span>
              </div>
              <button>
                <ChevronRight/>
                Manage
              </button>
            </div>
            <p>Protect your account with an authenticator app</p>
          </div>
          <div>
            <div>
              <ShieldIcon/>
            </div>
            <div>
              <div>
                <div>
                <h2>Active Sessions</h2>
                <p>Manage Devices currently signed in to your account</p>
              </div>
                <button>
                  View Sessions <ChevronRight/>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div>
          <span>Devices</span>
        <button>Logout All Devices</button>
        </div>
        <div>

          <div>
            <div><Monitor/></div>
            <div>
              <div>
                <h2>Window PC</h2>
                <span>Current</span>
              </div>
              <p>Chrome. India. Active now</p>
            </div>
          </div>
          
          <div>
            <div>
              <Smartphone/>
            </div>
            <div>
              <div>
                <h2>Android Phone</h2>
                Chrome. India. 2 hour ago
              </div>
              <button>Logout</button>
            </div>
          </div>

          <div>
            <div>
              <LaptopIcon/>
            </div>
            <div>
              <div>
                <h2>MacBook Pro</h2>
                Safari. India. yesterday
              </div>
              <button>Logout</button>
            </div>
          </div>

        </div>
      </div>

      <div>
        <div>
          <ShieldCheck/>
        </div>
        <div>
          <h2>Keep your account secure</h2>
          <p>Reiview your active sessions regurarly and log out of devices you no longer use.</p>
          <button>Review Security <ArrowUpLeft/></button>
        </div>
      </div>

      <div>
        <span>Session</span>
        <div>
          <div><LogOut/></div>
          <div>
            <div>
              <h2>Sign Out</h2>
              <p>Sign out from your current peer.Hiring session.</p>
            </div>
            <div>
              <button>Logout btn</button>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <span>Dangor Zone</span>
        <div>
          <div>
            <div>
            <TrashIcon/>
          </div>
          <div>
            <div>
              <h2>Delete Account</h2>
              <p>Parmanently delete your Peer.Hiring account and associated Data.</p>
            </div>
            <button>Delete Account</button>
          </div>
          </div>
          <div>
            <TriangleAlert/>
            <p>Account deletion is parmanent. Make sure you have backed up anything you need before continuning.</p>
          </div>

        </div>
      </div>
    </div>
  )
}
