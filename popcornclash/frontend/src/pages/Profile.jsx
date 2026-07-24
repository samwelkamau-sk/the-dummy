import { useState, useEffect } from 'react';
import { useGame } from '../context/GameStateContext';
import { api } from '../utils/backendApi';

export default function Profile() {
  const { setUser } = useGame();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      try {
        const data = await api.users.profile();
        setProfile(data.user);
        setUser({
          isAuthenticated: true,
          username: data.user.username,
          role: data.user.role,
          streak_count: data.user.prediction_streak,
          current_level: data.user.current_level,
          current_xp: data.user.total_xp,
          xp_to_next_level: 100,
          favorite_club: data.user.favorite_club,
        });
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [setUser]);

  if (loading) {
    return (
      <div className="rounded-3xl border border-gray-800/80 bg-pitch-card p-8 text-center">
        <p className="text-xs text-on-surface-variant uppercase tracking-[0.2em]">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-3xl border border-gray-800/80 bg-pitch-card p-8 text-center">
        <p className="text-xs text-on-surface-variant uppercase tracking-[0.2em]">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-gray-800/80 bg-pitch-card p-6 shadow-card-glow">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-popcorn-gold to-popcorn-glow text-xl font-black text-pitch-dark">
              {profile.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-popcorn-gold">PopcornClash Member</div>
              <h2 className="mt-1 text-2xl font-black text-white">{profile.username}</h2>
              <div className="mt-1 text-sm text-on-surface-variant">Favorite Club: {profile.favorite_club || 'Not set'}</div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-800/80 bg-pitch-over/70 px-4 py-3 text-center">
            <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-on-surface-variant">Profile Level</div>
            <div className="mt-1 text-3xl font-black text-white">{profile.current_level}</div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-gray-800/80 bg-pitch-card p-6 shadow-card-glow">
        <div className="text-xs font-semibold uppercase tracking-[0.35em] text-popcorn-gold">Historical Forecast Ledger</div>
        <div className="mt-4 space-y-3">
          {profile.predictions && profile.predictions.length > 0 ? (
            profile.predictions.map((pred) => (
              <div key={pred.id} className="rounded-2xl border border-gray-800/80 bg-pitch-over/70 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="font-semibold text-white">{pred.home_name} vs {pred.away_name}</div>
                    <div className="mt-1 text-sm text-on-surface-variant">
                      Prediction locked{pred.match_date ? ` · ${new Date(pred.match_date).toLocaleDateString()}` : ''}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-popcorn-gold/20 bg-popcorn-gold/10 px-4 py-2 text-right">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-popcorn-gold">Confidence</div>
                    <div className="mt-1 text-sm font-semibold text-white">{pred.confidence_score}%</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-gray-800/80 bg-pitch-over/70 p-4 text-center">
              <p className="text-xs text-on-surface-variant">No predictions yet. Start predicting!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}