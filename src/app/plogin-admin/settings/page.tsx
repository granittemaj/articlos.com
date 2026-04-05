'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'

interface AdminUser {
  id: string
  email: string
  name: string | null
  role: string
  createdAt: string
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

export default function SettingsPage() {
  const { data: session } = useSession()
  const currentRole = (session?.user as { role?: string })?.role || 'admin'
  const isAdmin = currentRole === 'admin' || session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL

  // Profile state
  const [profileName, setProfileName] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Team state
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [newName, setNewName] = useState('')
  const [newUserPassword, setNewUserPassword] = useState('')
  const [newRole, setNewRole] = useState('editor')
  const [addingUser, setAddingUser] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editRole, setEditRole] = useState('')
  const [editPassword, setEditPassword] = useState('')
  const [savingEdit, setSavingEdit] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [teamMsg, setTeamMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const loadUsers = useCallback(async () => {
    setLoadingUsers(true)
    try {
      const res = await fetch('/api/admin/users')
      if (res.ok) {
        const data = await res.json()
        setUsers(data.users || [])
      }
    } finally {
      setLoadingUsers(false)
    }
  }, [])

  useEffect(() => {
    if (isAdmin) loadUsers()
  }, [isAdmin, loadUsers])

  useEffect(() => {
    if (session?.user?.name) {
      setProfileName(session.user.name)
    }
  }, [session])

  async function handleProfileSave() {
    setProfileSaving(true)
    setProfileMsg(null)

    if (newPassword && newPassword !== confirmPassword) {
      setProfileMsg({ type: 'error', text: 'New passwords do not match.' })
      setProfileSaving(false)
      return
    }

    if (newPassword && newPassword.length < 6) {
      setProfileMsg({ type: 'error', text: 'Password must be at least 6 characters.' })
      setProfileSaving(false)
      return
    }

    if (newPassword && !currentPassword) {
      setProfileMsg({ type: 'error', text: 'Current password is required to change password.' })
      setProfileSaving(false)
      return
    }

    // Find current user in the users list to get their ID
    const currentUser = users.find(u => u.email === session?.user?.email)
    if (currentUser) {
      try {
        const body: { name?: string; password?: string } = { name: profileName }
        if (newPassword) body.password = newPassword

        const res = await fetch(`/api/admin/users/${currentUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (res.ok) {
          setProfileMsg({ type: 'success', text: 'Profile updated successfully.' })
          setCurrentPassword('')
          setNewPassword('')
          setConfirmPassword('')
          loadUsers()
        } else {
          const data = await res.json()
          setProfileMsg({ type: 'error', text: data.error || 'Failed to update profile.' })
        }
      } catch {
        setProfileMsg({ type: 'error', text: 'Failed to update profile.' })
      }
    } else {
      setProfileMsg({ type: 'success', text: 'Profile settings saved.' })
    }
    setProfileSaving(false)
  }

  async function handleAddUser() {
    setAddingUser(true)
    setTeamMsg(null)

    if (!newEmail || !newUserPassword) {
      setTeamMsg({ type: 'error', text: 'Email and password are required.' })
      setAddingUser(false)
      return
    }

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newEmail,
          password: newUserPassword,
          name: newName || null,
          role: newRole,
        }),
      })
      if (res.ok) {
        setTeamMsg({ type: 'success', text: 'Team member added successfully.' })
        setNewEmail('')
        setNewName('')
        setNewUserPassword('')
        setNewRole('editor')
        setShowAddForm(false)
        loadUsers()
      } else {
        const data = await res.json()
        setTeamMsg({ type: 'error', text: data.error || 'Failed to add user.' })
      }
    } catch {
      setTeamMsg({ type: 'error', text: 'Failed to add user.' })
    }
    setAddingUser(false)
  }

  async function handleEditSave(id: string) {
    setSavingEdit(true)
    setTeamMsg(null)
    try {
      const body: { name?: string; role?: string; password?: string } = {
        name: editName,
        role: editRole,
      }
      if (editPassword) body.password = editPassword

      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        setTeamMsg({ type: 'success', text: 'User updated successfully.' })
        setEditingId(null)
        setEditPassword('')
        loadUsers()
      } else {
        const data = await res.json()
        setTeamMsg({ type: 'error', text: data.error || 'Failed to update user.' })
      }
    } catch {
      setTeamMsg({ type: 'error', text: 'Failed to update user.' })
    }
    setSavingEdit(false)
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    setTeamMsg(null)
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setTeamMsg({ type: 'success', text: 'User deleted.' })
        loadUsers()
      } else {
        const data = await res.json()
        setTeamMsg({ type: 'error', text: data.error || 'Failed to delete user.' })
      }
    } catch {
      setTeamMsg({ type: 'error', text: 'Failed to delete user.' })
    }
    setDeletingId(null)
  }

  function startEdit(user: AdminUser) {
    setEditingId(user.id)
    setEditName(user.name || '')
    setEditRole(user.role)
    setEditPassword('')
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Settings</h1>
        </div>
      </div>

      <div className="page-body">
        {/* Section 1: Profile */}
        <div style={{
          background: '#ffffff', border: '1px solid #e8e8e6', borderRadius: 10,
          padding: 24, marginBottom: 24,
        }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#0f0f0e', marginBottom: 20 }}>
            Profile
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 420 }}>
            {/* Email (read-only) */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#6b6b67', marginBottom: 6 }}>
                Email
              </label>
              <input
                type="email"
                value={session?.user?.email || ''}
                disabled
                className="form-input"
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              />
            </div>

            {/* Name */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#6b6b67', marginBottom: 6 }}>
                Name
              </label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="form-input"
                placeholder="Your name"
              />
            </div>

            {/* Change password */}
            <div style={{ borderTop: '1px solid #e8e8e6', paddingTop: 16, marginTop: 4 }}>
              <p style={{ fontSize: 14, fontWeight: 500, color: '#0f0f0e', marginBottom: 12 }}>
                Change Password
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="form-input"
                  placeholder="Current password"
                />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="form-input"
                  placeholder="New password"
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-input"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            {profileMsg && (
              <p style={{
                fontSize: 13,
                color: profileMsg.type === 'success' ? '#16a34a' : '#dc2626',
                margin: 0,
              }}>
                {profileMsg.text}
              </p>
            )}

            <div>
              <button
                onClick={handleProfileSave}
                disabled={profileSaving}
                className="btn btn-primary btn-sm"
                style={{ opacity: profileSaving ? 0.6 : 1 }}
              >
                {profileSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Team Members (admin only) */}
        {isAdmin && (
          <div style={{
            background: '#ffffff', border: '1px solid #e8e8e6', borderRadius: 10,
            padding: 24,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: '#0f0f0e', margin: 0 }}>
                Team Members
              </h2>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="btn btn-primary btn-sm"
              >
                {showAddForm ? 'Cancel' : '+ Add Member'}
              </button>
            </div>

            {teamMsg && (
              <p style={{
                fontSize: 13, marginBottom: 16,
                color: teamMsg.type === 'success' ? '#16a34a' : '#dc2626',
              }}>
                {teamMsg.text}
              </p>
            )}

            {/* Add member form */}
            {showAddForm && (
              <div style={{
                background: '#f9f9f8', border: '1px solid #e8e8e6', borderRadius: 8,
                padding: 20, marginBottom: 20,
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 500 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#6b6b67', marginBottom: 4 }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="form-input"
                      placeholder="user@example.com"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#6b6b67', marginBottom: 4 }}>
                      Name
                    </label>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="form-input"
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#6b6b67', marginBottom: 4 }}>
                      Password *
                    </label>
                    <input
                      type="password"
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      className="form-input"
                      placeholder="Password"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#6b6b67', marginBottom: 4 }}>
                      Role
                    </label>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="form-input"
                      style={{ appearance: 'auto' }}
                    >
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                <div style={{ marginTop: 16 }}>
                  <button
                    onClick={handleAddUser}
                    disabled={addingUser}
                    className="btn btn-primary btn-sm"
                    style={{ opacity: addingUser ? 0.6 : 1 }}
                  >
                    {addingUser ? 'Adding...' : 'Add Member'}
                  </button>
                </div>
              </div>
            )}

            {/* Users table */}
            {loadingUsers ? (
              <div style={{ padding: '32px 0', textAlign: 'center', color: '#a0a09c', fontSize: 14 }}>
                Loading...
              </div>
            ) : users.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '40px 24px',
                background: '#f9f9f8', border: '1px solid #e8e8e6', borderRadius: 8,
              }}>
                <p style={{ fontSize: 14, color: '#6b6b67' }}>
                  No team members yet. Add your first team member above.
                </p>
              </div>
            ) : (
              <div style={{
                border: '1px solid #e8e8e6', borderRadius: 8, overflow: 'hidden',
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e8e8e6', background: '#f9f9f8' }}>
                      <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6b6b67' }}>
                        Email
                      </th>
                      <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6b6b67' }}>
                        Name
                      </th>
                      <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6b6b67', width: 100 }}>
                        Role
                      </th>
                      <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6b6b67', width: 120 }}>
                        Joined
                      </th>
                      <th style={{ padding: '10px 16px', width: 120 }} />
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, i) => (
                      <tr
                        key={user.id}
                        style={{ borderBottom: i < users.length - 1 ? '1px solid #f0f0ee' : 'none' }}
                      >
                        {editingId === user.id ? (
                          <>
                            <td style={{ padding: '10px 16px', fontSize: 14, color: '#0f0f0e' }}>
                              {user.email}
                            </td>
                            <td style={{ padding: '10px 16px' }}>
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="form-input"
                                style={{ padding: '4px 8px', fontSize: 13 }}
                              />
                            </td>
                            <td style={{ padding: '10px 16px' }}>
                              <select
                                value={editRole}
                                onChange={(e) => setEditRole(e.target.value)}
                                className="form-input"
                                style={{ padding: '4px 8px', fontSize: 13, appearance: 'auto' }}
                              >
                                <option value="editor">Editor</option>
                                <option value="admin">Admin</option>
                              </select>
                            </td>
                            <td style={{ padding: '10px 16px' }}>
                              <input
                                type="password"
                                value={editPassword}
                                onChange={(e) => setEditPassword(e.target.value)}
                                className="form-input"
                                placeholder="New pwd"
                                style={{ padding: '4px 8px', fontSize: 13 }}
                              />
                            </td>
                            <td style={{ padding: '10px 16px', display: 'flex', gap: 6 }}>
                              <button
                                onClick={() => handleEditSave(user.id)}
                                disabled={savingEdit}
                                style={{
                                  fontSize: 12, color: '#16a34a', background: 'none',
                                  border: 'none', cursor: 'pointer', padding: '4px 8px',
                                  borderRadius: 4, fontFamily: 'Geist, sans-serif',
                                }}
                              >
                                {savingEdit ? '...' : 'Save'}
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                style={{
                                  fontSize: 12, color: '#6b6b67', background: 'none',
                                  border: 'none', cursor: 'pointer', padding: '4px 8px',
                                  borderRadius: 4, fontFamily: 'Geist, sans-serif',
                                }}
                              >
                                Cancel
                              </button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td style={{ padding: '12px 16px', fontSize: 14, color: '#0f0f0e' }}>
                              {user.email}
                            </td>
                            <td style={{ padding: '12px 16px', fontSize: 14, color: '#6b6b67' }}>
                              {user.name || '-'}
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <span style={{
                                fontSize: 12, fontWeight: 500,
                                padding: '2px 8px', borderRadius: 4,
                                background: user.role === 'admin' ? '#fef3c7' : '#f0f0ee',
                                color: user.role === 'admin' ? '#92400e' : '#6b6b67',
                              }}>
                                {user.role}
                              </span>
                            </td>
                            <td style={{ padding: '12px 16px', fontSize: 13, color: '#a0a09c' }}>
                              {formatDate(user.createdAt)}
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <div style={{ display: 'flex', gap: 6 }}>
                                <button
                                  onClick={() => startEdit(user)}
                                  style={{
                                    fontSize: 12, color: '#6b6b67', background: 'none',
                                    border: 'none', cursor: 'pointer', padding: '4px 8px',
                                    borderRadius: 4, fontFamily: 'Geist, sans-serif',
                                  }}
                                >
                                  Edit
                                </button>
                                {user.email !== session?.user?.email && (
                                  <button
                                    onClick={() => handleDelete(user.id)}
                                    disabled={deletingId === user.id}
                                    style={{
                                      fontSize: 12, color: '#dc2626', background: 'none',
                                      border: 'none', cursor: 'pointer', padding: '4px 8px',
                                      borderRadius: 4, fontFamily: 'Geist, sans-serif',
                                      opacity: deletingId === user.id ? 0.5 : 1,
                                    }}
                                  >
                                    {deletingId === user.id ? '...' : 'Delete'}
                                  </button>
                                )}
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
